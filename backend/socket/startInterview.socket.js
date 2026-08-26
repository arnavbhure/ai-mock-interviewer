const {
  getLatestInterviewByInterviewId,
} = require("../models/interview/getLatestInterviewOfCandidiate");
const {
  startInterviewService,
} = require("../services/interview/startInterview.services");
const {
  submitAnswerService,
} = require("../services/interview/submitAnswer.services");

const registerInterviewSocket = async (socket) => {
  socket.on("interview:start", async () => {
    try {
      const interviewId = socket.interview.interview_id;
      const interview = await getLatestInterviewByInterviewId(interviewId);

      if (!interview) {
        throw new Error("Interview not found");
      }

      const interviewGraphResponse = await startInterviewService(interview);

      if (interviewGraphResponse.interrupted) {
        socket.emit("interview:question", {
          roundNumber: interviewGraphResponse.result.currentRoundNumber,
          questionNumber: interviewGraphResponse.result.currentQuestionNumber,
          difficulty: interviewGraphResponse.result.currentDifficulty,
          question: interviewGraphResponse.result.currentQuestion,
        });
        return;
      }

      socket.emit("interview:completed", {
        interviewId: interviewGraphResponse.threadId,
        evaluation: interviewGraphResponse.result.finalEvaluation,
      });
    } catch (err) {
      console.log("Error in interview:start event:", err);
      socket.emit("interview:error", {
        code: "INTERVIEW_START_FAILED",
        message: err.message || "Failed to start the interview.",
      });
    }
  });

  socket.on("interview:answer", async ({ answer }) => {
    try {
      if (typeof answer !== "string" || answer.trim() === "") {
        socket.emit("interview:error", {
          code: "INVALID_ANSWER",
          message: "Answer must be a non-empty string.",
        });
        return;
      }

      const interviewGraphResponse = await submitAnswerService({
        interviewId: socket.interview.interview_id,
        answer: answer.trim(),
      });

      if (interviewGraphResponse.interrupted) {
        socket.emit("interview:question", {
          roundNumber: interviewGraphResponse.result.currentRoundNumber,

          questionNumber: interviewGraphResponse.result.currentQuestionNumber,

          difficulty: interviewGraphResponse.result.currentDifficulty,

          question: interviewGraphResponse.result.currentQuestion,
        });

        return;
      }

      socket.emit("interview:completed", {
        interviewId: interviewGraphResponse.threadId,
        evaluation: interviewGraphResponse.result.finalEvaluation,
      });
    } catch (err) {
      console.error("Error in interview:answer event:", err);

      socket.emit("interview:error", {
        code: "ANSWER_PROCESSING_FAILED",
        message: err.message || "Failed to process the answer.",
      });
    }
  });
};

module.exports = { registerInterviewSocket };
