const {
  appendInterviewEvaluationModel,
} = require("../../../models/evaluation/interviewEvaluation.model");
const { EvaluationAnswerChain } = require("../chains/evaluateAnswer.chain");

const evaluateAnswerNode = async (state) => {
  const currentRound =
    state.interviewPlan?.rounds[state.currentRoundNumber - 1];

  const currentQuestion = state.currentQuestion;
  const currentAnswer = state.currentAnswer;

  if (!currentQuestion) {
    throw new Error("Cannot evaluate: current question is missing.");
  }

  if (!currentAnswer) {
    throw new Error("Cannot evaluate: candidate answer is missing.");
  }

  const questionText =
    currentQuestion.question || currentQuestion.text || "";

  const evaluationResult = await EvaluationAnswerChain.invoke({
    role: state.role,
    roundType: currentRound.roundType || currentRound.type,
    difficulty: state.currentDifficulty,
    question: questionText,
    answer: currentAnswer,
  });

  const evaluation = {
    question: currentQuestion,
    answer: currentAnswer,
    roundNumber: state.currentRoundNumber,
    roundType: currentRound.roundType || currentRound.type,
    questionNumber: state.currentQuestionNumber,
    ...evaluationResult,
  };

  await appendInterviewEvaluationModel(state.interviewId, evaluation);

  const updatedConversationHistory = [
    ...(state.conversationHistory ?? []),
    {
      role: "interviewer",
      content: questionText,
    },
    {
      role: "candidate",
      content: currentAnswer,
    },
  ];

  const topic =
    currentQuestion.focusArea ||
    (Array.isArray(currentRound.focusAreas) && currentRound.focusAreas[0]) ||
    currentRound.displayName ||
    "Technical";

  const newQuestionScore = {
    roundIndex: Math.max(0, state.currentRoundNumber - 1),
    questionNumber: state.currentQuestionNumber,
    score: evaluationResult.score,
    difficulty: state.currentDifficulty,
    topic: topic,
  };

  const updatedQuestionScores = [
    ...(state.questionScores ?? []),
    newQuestionScore,
  ];

  return {
    lastEvaluation: evaluationResult,
    conversationHistory: updatedConversationHistory,
    questionScores: updatedQuestionScores,
    phase: "evaluation",
  };
};

module.exports = { evaluateAnswerNode };
