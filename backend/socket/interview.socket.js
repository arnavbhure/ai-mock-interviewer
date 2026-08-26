const {
  getLatestInterviewByInterviewId,
} = require("../models/interview/getLatestInterviewOfCandidiate");
const {
  startInterviewService,
} = require("../services/interview/startInterview.services");

const registerInterviewSocket = async (socket) => {
  socket.on("interview:start", async () => {
    try {
      const interviewId = socket.interview.interview_id;
      const interview = await getLatestInterviewByInterviewId(interviewId);

      const interviewGraphResponse = await startInterviewService(interview);

      if (interviewGraphResponse.interrupted) {
        socket.emit("interview:answer", {
          roundNumber: interviewGraphResponse.result.currentRoundNumber,
          questionNumber: interviewGraphResponse.result.currentQuestionNumber,
          difficulty: interviewGraphResponse.result.currentDifficulty,
          question: interviewGraphResponse.result.currentQuestion,
        });
      }
    } catch (err) {
      console.log("Error in interview:start event:", err);
      socket.emit("interview:error", {
        code: "INTERVIEW_START_FAILED",
        message: err.message || "Failed to start the interview.",
      });
    }
  });
};

module.exports = { registerInterviewSocket };
