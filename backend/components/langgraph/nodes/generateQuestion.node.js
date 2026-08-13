const { QuestionGeneratorChain } = require("../chains/questionGenerator.chain");

const generateQuestionNode = async (state) => {
  const currentRound = state.interviewPlan.rounds[state.currentRoundNumber - 1];

  const result = await QuestionGeneratorChain.invoke({
    role: state.role,
    roundType: currentRound.type,
    currentRound: currentRound.displayName,
    objective: currentRound.objective,
    difficulty: state.currentDifficulty,
    roundDifficulty: currentRound.difficulty,
    topics: currentRound.topics.join(", "),
    questionNumber: state.currentQuestionNumber,
    resume: JSON.stringify(state.resume ?? {}),
    resumeContext: JSON.stringify(state.resumeContext ?? []),
    conversationHistory: JSON.stringify(state.conversationHistory ?? []),
  });

  return {
    currentQuestion: result,
    phase: "waiting_for_answer",
  };
};

module.exports = { generateQuestionNode };
