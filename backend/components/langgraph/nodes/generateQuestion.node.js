const { QuestionGeneratorChain } = require("../chains/questionGenerator.chain");

const generateQuestionNode = async (state) => {
  const currentRound =
    state.interviewPlan?.rounds?.[state.currentRoundNumber - 1];

  if (!currentRound) {
    throw new Error(
      `Round ${state.currentRoundNumber} not found in interview plan.`,
    );
  }

  const focusAreasList = Array.isArray(currentRound.focusAreas)
    ? currentRound.focusAreas
    : Array.isArray(currentRound.topics)
      ? currentRound.topics
      : [];
  const focusAreas = focusAreasList.join(", ");

  const result = await QuestionGeneratorChain.invoke({
    role: state.role,
    roundType: currentRound.roundType || currentRound.type,
    currentRound: currentRound.displayName,
    objective: currentRound.objective,
    difficulty: state.currentDifficulty,
    roundDifficulty: currentRound.difficulty,
    focusAreas,
    topics: focusAreas,
    questionNumber: state.currentQuestionNumber,
    resume: JSON.stringify(state.resume ?? {}),
    resumeContext: JSON.stringify(state.resumeContext ?? []),
    conversationHistory: JSON.stringify(state.conversationHistory ?? []),
    evaluationHistory: JSON.stringify(state.questionScores ?? []),
  });

  return {
    currentQuestion: result,
    phase: "waiting_for_answer",
  };
};

module.exports = { generateQuestionNode };
