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
  codeExecutionService,
} = require("../../services/dsa/codeExecution.service");
const { main_graph } = require("../../components/langgraph/graph/main_graph");
const { Command } = require("@langchain/langgraph");
const { io } = require("../../config/socket");

const submitCodeController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { code, language, interviewId, problemId } = req.body;
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

      // Handle real-time Socket.IO emission to candidate
      if (io && interviewId) {
        if (graphResumeResult.__interrupt__) {
          const nextInterrupt = graphResumeResult.__interrupt__[0];
          if (nextInterrupt?.value?.type === "dsa_round") {
            const nextProblem = nextInterrupt.value.problem;
            io.to(interviewId).emit("interview:dsa", {
              problemId: nextProblem.id,
              problemTitle: nextProblem.title,
              problemDescription: nextProblem.description,
              problemDifficulty: nextProblem.difficulty,
              problemTopics: nextProblem.topics,
              publicTestsSource: nextProblem.public_tests_source,
              currentQuestionNumber: graphResumeResult.currentQuestionNumber,
              roundNumber: graphResumeResult.currentRoundNumber,
            });
          } else if (nextInterrupt?.value?.type === "wait_for_answer") {
            io.to(interviewId).emit("interview:question", {
              roundNumber: graphResumeResult.currentRoundNumber,
              questionNumber: graphResumeResult.currentQuestionNumber,
              difficulty: graphResumeResult.currentDifficulty,
              question:
                graphResumeResult.currentQuestion?.question ||
                graphResumeResult.currentQuestion ||
                "",
            });
          }
        } else if (
          graphResumeResult.phase === "finalization" ||
          graphResumeResult.finalEvaluation
        ) {
          io.to(interviewId).emit("interview:completed", {
            interviewId,
            evaluation: graphResumeResult.finalEvaluation,
          });
        }
      }
    } catch (resumeErr) {
      console.error(
        "Failed to resume LangGraph thread after submission:",
        resumeErr,
      );
    }

    /* Sample output for code_execution_result : 
        {
  verdict: 'wrong_answer',
  score: 66.67,
  passed: 2,
  total: 3,
  time_limit: 2,
  compile_error: null,
  tests: [
    {
      verdict: 'accepted',
      hidden: false,
      time: '0.0372',
      memory: '14376',
      exit_code: 0,
      signal: null,
      output: '3\n',
      error: '',
      truncated: false,
      files: [],
      files_truncated: false
    },
    {
      verdict: 'wrong_answer',
      hidden: false,
      time: '0.0345',
      memory: '13008',
      exit_code: 0,
      signal: null,
      output: '11\n',
      error: '',
      truncated: false,
      files: [],
      files_truncated: false
    },
    {
      verdict: 'accepted',
      hidden: false,
      time: '0.0329',
      memory: '13032',
      exit_code: 0,
      signal: null,
      output: '6\n',
      error: '',
      truncated: false,
      files: [],
      files_truncated: false
    }
  ]
}
    */

    return res.status(200).json({
      message: "Code submitted successfully.",
      success: true,
      data: code_execution_result,
      evaluation: evaluation_result,
      graphResult: graphResumeResult,
    });
  } catch (err) {
    console.log("Error in submitCodeController : ", err);
    return res
      .status(500)
      .json({ message: "Failed to submit code.", success: false });
  }
};

module.exports = { submitCodeController };
