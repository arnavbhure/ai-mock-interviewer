const initialState = (interview) => {
  return {
    interviewId: interview.id,
    userId: interview.user_id,
    resumeId: interview.resume_id,

    role: interview.role,
    interviewPlan: interview.interview_plan,

    currentRoundNumber: interview.current_round,
    currentQuestionNumber: interview.current_question,

    currentDifficulty: interview.difficulty,

    questionScores: [],
    conversationHistory: [],
    messages: [],

    phase: "initialization",
    status: "active",
    shouldContinue: true,

    DSAreservedQuestionsID: [],

    error: null,
    retryCount: 0,

    stateVersion: 1,
  };
};

module.exports = { initialState };
