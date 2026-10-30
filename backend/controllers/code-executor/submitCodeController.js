const {
  dsaEvaluationChain,
} = require("../../components/langchain/chains/dsaEvaluationChain");
const {
  getProblemStatementDeatils,
} = require("../../models/dsaProblems/getProblemStatement");
const {
  getHiddenTestCases,
} = require("../../models/dsaProblems/getProblemTestCases");
const {
  saveDsaEvaluationResultModel,
} = require("../../models/dsaProblems/saveDsaEvaluationResultModel");
const {
  checkInterviewModel,
} = require("../../models/interview/checkInterviewModel");
const {
  getLatestInterviewByUserId,
} = require("../../models/interview/getLatestInterviewOfCandidiate");
const {
  codeExecutionService,
} = require("../../services/dsa/codeExecution.service");
const { main_graph } = require("../../components/langgraph/graph/main_graph");
const { Command } = require("@langchain/langgraph");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const submitCodeController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { code, language, problemId } = req.body;
    let interviewId = req.body.interviewId;

    if (!interviewId || !UUID_REGEX.test(String(interviewId))) {
      const latest = await getLatestInterviewByUserId(user.id);
      if (latest) {
        interviewId = latest.id;
      }
    }

    if (!code || !language || !interviewId || !problemId) {
      return res.status(400).json({
        message:
          "Please provide code , Problem id and language to submit the code.",
        success: false,
      });
    }
    const is_valid_interview = await checkInterviewModel(interviewId, user.id);
    if (!is_valid_interview) {
      return res.status(400).json({
        message: "Invalid interview.",
        success: false,
      });
    }

    const problemDetails = await getProblemStatementDeatils(problemId);
    if (!problemDetails) {
      return res.status(404).json({
        message: "Problem statement not found.",
        success: false,
      });
    }

    // 1. Fetch hidden test cases from problem_test_cases table
    let rawTestCases = await getHiddenTestCases(problemId, 8);

    // 2. Fallback to public test cases if problem_test_cases has none
    if (!rawTestCases || rawTestCases.length === 0) {
      if (problemDetails.public_tests_source) {
        try {
          const parsed =
            typeof problemDetails.public_tests_source === "string"
              ? JSON.parse(problemDetails.public_tests_source)
              : problemDetails.public_tests_source;
          if (Array.isArray(parsed)) {
            rawTestCases = parsed.map((t) => ({
              input_data: t.input ?? t,
              expected_output: t.expectedOutput ?? t.expected_output ?? t.output ?? "",
              visibility: "hidden",
            }));
          }
        } catch {
          // ignore json parse error
        }
      }
    }

    const test_cases = (rawTestCases || []).map((t) => {
      let inputStr = "";
      if (t.stdin_input) {
        inputStr = String(t.stdin_input);
      } else if (typeof t.input_data === "string") {
        inputStr = t.input_data;
      } else if (t.input_data !== undefined && t.input_data !== null) {
        inputStr = JSON.stringify(t.input_data);
      }

      let expectedStr = "";
      if (t.expected_stdout) {
        expectedStr = String(t.expected_stdout);
      } else if (typeof t.expected_output === "string") {
        expectedStr = t.expected_output;
      } else if (t.expected_output !== undefined && t.expected_output !== null) {
        expectedStr =
          typeof t.expected_output === "object"
            ? JSON.stringify(t.expected_output)
            : String(t.expected_output);
      }

      return {
        input: inputStr,
        expectedOutput: expectedStr,
        hidden: true,
      };
    });

    let code_execution_result = null;
    if (test_cases.length > 0) {
      code_execution_result = await codeExecutionService({
        code,
        language,
        test_cases,
      });
    }

    const { title, description } = problemDetails;

    const evaluation_result = await dsaEvaluationChain.invoke({
      code,
      title,
      problemStatement: description,
      judgeVerdict: JSON.stringify(code_execution_result),
    });

    await saveDsaEvaluationResultModel({
      evaluation_result,
      interviewId,
      problemId,
    });

    // Resume LangGraph thread with evaluation result
    let graphResumeResult = null;
    try {
      graphResumeResult = await main_graph.invoke(
        new Command({
          resume: {
            evaluation: evaluation_result,
            problemId,
          },
        }),
        {
          configurable: {
            thread_id: interviewId,
          },
        },
      );
    } catch (resumeErr) {
      console.error(
        "Failed to resume LangGraph thread after submission:",
        resumeErr,
      );
    }

    return res.status(200).json({
      message: "Code submitted successfully.",
      success: true,
      data: code_execution_result,
      evaluation: evaluation_result,
      graphResult: graphResumeResult,
      interviewId,
    });
  } catch (err) {
    console.log("Error in submitCodeController : ", err);
    return res
      .status(500)
      .json({ message: "Failed to submit code.", success: false });
  }
};

module.exports = { submitCodeController };
