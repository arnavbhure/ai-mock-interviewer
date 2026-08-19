const advanceInterviewNode = async (state) => {
  const currentRound = state.interviewPlan.rounds[state.currentRoundNumber - 1];

  if (!currentRound) {
    throw new Error("Current round not found.");
  }

  const roundCompleted =
    state.currentQuestionNumber >= currentRound.numberOfQuestions;

  if (!roundCompleted) {
    return {
      currentQuestionNumber: state.currentQuestionNumber + 1,

      currentQuestion: null,
      currentAnswer: null,

      phase: "question_generation",
    };
  }

  const interviewCompleted =
    state.currentRoundNumber >= state.interviewPlan.rounds.length;

  if (interviewCompleted) {
    return {
      shouldContinue: false,
      status: "completed",
      phase: "finalization",
    };
  }

  return {
    currentRoundNumber: state.currentRoundNumber + 1,

    currentQuestionNumber: 1,

    currentQuestion: null,
    currentAnswer: null,

    phase: "question_generation",
  };
};

module.exports = { advanceInterviewNode };
