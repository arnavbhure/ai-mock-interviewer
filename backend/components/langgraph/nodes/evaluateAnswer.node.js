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

  const evaluationResult = await EvaluationAnswerChain.invoke({
    role: state.role,
    roundType: currentRound.roundType,
    difficulty: state.currentDifficulty,
    question: state.currentQuestion.question,
    answer: state.currentAnswer,
  });

  const evaluation = {
    question: currentQuestion,
    answer: currentAnswer,
    roundNumber: state.currentRoundNumber,
    roundType: currentRound.roundType,
    questionNumber: state.currentQuestionNumber,
    ...evaluationResult,
  };

  await appendInterviewEvaluationModel(state.interviewId, evaluation);

  return {
    lastEvaluation: evaluationResult,
    phase: "evaluation",
  };
};

module.exports = { evaluateAnswerNode };
