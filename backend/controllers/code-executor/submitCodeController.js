const {
  dsaEvaluationChain,
} = require("../../components/langchain/chains/dsaEvaluationChain");
const {
  getProblemStatementDeatils,
} = require("../../models/dsaProblems/getProblemStatement");
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

    /*
        todo : here we have to fetch the hidden test cases from the db with 
        there expected output and then we have to run the code 
    */

    const test_cases = []; // dummy for now
    const expected_output = []; // dummy for now untill implementation of fetching hidden test cases from db is done

    const code_execution_result = await codeExecutionService({
      code,
      language,
      test_cases: test_cases.map((test, index) => ({
        // check the implementation of this mapping first
        input: test.input ?? "",
        expected_output: expected_output[index] ?? "",
        hidden: true,
      })),
    });

    const problemDetails = await getProblemStatementDeatils(problemId);

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
