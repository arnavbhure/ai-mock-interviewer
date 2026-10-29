const {
  saveDsaEvaluationResultModel,
} = require("../../models/dsaProblems/saveDsaEvaluationResultModel");
const {
  saveDsaSubmissionModel,
} = require("../../models/dsaProblems/saveDsaSubmissionModel");
const {
  checkInterviewModel,
} = require("../../models/interview/checkInterviewModel");
const { main_graph } = require("../../components/langgraph/graph/main_graph");
const { Command } = require("@langchain/langgraph");
const { io } = require("../../config/socket");

const skipCodeController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { interviewId, problemId, code = "", language = "javascript" } = req.body;
    if (!interviewId || !problemId) {
      return res.status(400).json({
        message: "Please provide interviewId and problemId to skip problem.",
        success: false,
      });
    }

    const isValidInterview = await checkInterviewModel(interviewId, user.id);
    if (!isValidInterview) {
      return res.status(400).json({
        message: "Invalid interview session.",
        success: false,
      });
    }

    const skipEvaluation = {
      score: 0,
      correctness: "Skipped by candidate",
      timeComplexity: "N/A",
      spaceComplexity: "N/A",
      strengths: [],
      weaknesses: ["Problem was skipped without completing submission."],
      feedback:
        "The candidate opted to skip this coding challenge. No working implementation was submitted.",
    };

    // 1. Persist skip evaluation
    await saveDsaEvaluationResultModel({
      evaluation_result: skipEvaluation,
      interviewId,
      problemId,
    });

    // 2. Persist in dsa_submissions
    await saveDsaSubmissionModel({
      interviewId,
      problemId,
      code: code || "// Problem skipped by candidate",
      language,
      verdict: "skipped",
      passedTests: 0,
      totalTests: 0,
      executionTime: "0.00s",
      memory: "0MB",
      isSkip: true,
    });

    // 3. Resume LangGraph thread with Command({ resume: ... })
    let graphResumeResult = null;
    try {
      graphResumeResult = await main_graph.invoke(
        new Command({
          resume: {
            evaluation: skipEvaluation,
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
        } else if (graphResumeResult.phase === "finalization" || graphResumeResult.finalEvaluation) {
          io.to(interviewId).emit("interview:completed", {
            interviewId,
            evaluation: graphResumeResult.finalEvaluation,
          });
        }
      }
    } catch (resumeErr) {
      console.error("Failed to resume LangGraph thread after skip:", resumeErr);
    }

    return res.status(200).json({
      message: "Problem skipped successfully.",
      success: true,
      evaluation: skipEvaluation,
      graphResult: graphResumeResult,
    });
  } catch (err) {
    console.error("Error in skipCodeController:", err);
    return res.status(500).json({
      message: err.message || "Failed to skip problem.",
      success: false,
    });
  }
};

module.exports = { skipCodeController };
