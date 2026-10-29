const {
  getLatestInterviewByInterviewId,
} = require("../models/interview/getLatestInterviewOfCandidiate");
const {
  startInterviewService,
} = require("../services/interview/startInterview.services");
const {
  submitAnswerService,
} = require("../services/interview/submitAnswer.services");
const { streamQuestionAudio, stopTts } = require("../services/tts/tts.service");

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
        const result = interviewGraphResponse.result;
        const interrupts = result?.__interrupt__ || interviewGraphResponse.__interrupt__;
        const interruptInfo = interrupts?.[0];

        /* For DSA round interruption */
        if (interruptInfo?.value?.type === "dsa_round") {
          const DSAproblem = interruptInfo.value.problem;
          const dsaData = {
            interviewId: String(interviewId),
            problemId: DSAproblem.id,
            problemTitle: DSAproblem.title,
            problemDescription: DSAproblem.description,
            problemDifficulty: DSAproblem.difficulty,
            problemTopics: DSAproblem.topics,
            publicTestsSource: DSAproblem.public_tests_source,
            roundNumber: result.currentRoundNumber,
            currentQuestionNumber: result.currentQuestionNumber,
          };

          socket.emit("interview:dsa", dsaData);
          socket.emit("interview:dsa_round", dsaData);
          return;
        }

        /* For normal graph interruption */
        const roundNumber = result.currentRoundNumber;
        const questionNumber = result.currentQuestionNumber;
        const questionObj = result.currentQuestion;
        const questionText =
          typeof questionObj === "string"
            ? questionObj
            : questionObj?.question || questionObj?.text || "";

        socket.emit("interview:question", {
          interviewId: String(interviewId),
          roundNumber: roundNumber,
          questionNumber: questionNumber,
          difficulty: result.currentDifficulty,
          question: questionText,
        });

        if (questionText) {
          void streamQuestionAudio(socket, {
            questionId: `${interviewGraphResponse.threadId}:${roundNumber}:${questionNumber}`,
            questionText: questionText,
          });
        }

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

      const interviewId = socket.interview.interview_id;
      const interviewGraphResponse = await submitAnswerService({
        interviewId,
        answer: answer.trim(),
      });

      if (interviewGraphResponse.interrupted) {
        const result = interviewGraphResponse.result;
        const interrupts = result?.__interrupt__ || interviewGraphResponse.__interrupt__;
        const interruptInfo = interrupts?.[0];

        /* If transition leads to DSA round */
        if (interruptInfo?.value?.type === "dsa_round") {
          const DSAproblem = interruptInfo.value.problem;
          const dsaData = {
            interviewId: String(interviewId),
            problemId: DSAproblem.id,
            problemTitle: DSAproblem.title,
            problemDescription: DSAproblem.description,
            problemDifficulty: DSAproblem.difficulty,
            problemTopics: DSAproblem.topics,
            publicTestsSource: DSAproblem.public_tests_source,
            roundNumber: result.currentRoundNumber,
            currentQuestionNumber: result.currentQuestionNumber,
          };

          socket.emit("interview:dsa", dsaData);
          socket.emit("interview:dsa_round", dsaData);
          return;
        }

        const roundNumber = result.currentRoundNumber;
        const questionNumber = result.currentQuestionNumber;
        const questionObj = result.currentQuestion;
        const questionText =
          typeof questionObj === "string"
            ? questionObj
            : questionObj?.question || questionObj?.text || "";

        socket.emit("interview:question", {
          interviewId: String(interviewId),
          roundNumber: roundNumber,
          questionNumber: questionNumber,
          difficulty: result.currentDifficulty,
          question: questionText,
        });

        if (questionText) {
          void streamQuestionAudio(socket, {
            questionId: `${interviewGraphResponse.threadId}:${roundNumber}:${questionNumber}`,
            questionText: questionText,
          });
        }

        return;
      }

      socket.emit("interview:completed", {
        interviewId: interviewGraphResponse.threadId,
        evaluation: interviewGraphResponse.result.finalEvaluation,
      });

      socket.on("disconnect", () => {
        stopTts(socket.id);
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
