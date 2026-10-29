const {
  getDSAEvaluationsFromDBmodel,
} = require("../../../models/evaluation/getDSAEvaluationsFromDB.model");
const {
  getEvaluationResultsFromDB,
} = require("../../../models/evaluation/getEvaluationResultsFromDB.model");
const { finalEvaluationChain } = require("../chains/finalEvaluation.chain");

const FinalEvaluationNode = async (state) => {
  const [evaluationResultsFromDB, dsaEvaluations] = await Promise.all([
    getEvaluationResultsFromDB(state.interviewId),
    getDSAEvaluationsFromDBmodel(state.interviewId),
  ]);

  let evaluations = evaluationResultsFromDB[0]?.evaluations;

  if (!evaluations || !evaluations.length) {
    if (
      Array.isArray(state.questionScores) &&
      state.questionScores.length > 0
    ) {
      evaluations = state.questionScores;
    } else if (state.lastEvaluation) {
      evaluations = [state.lastEvaluation];
    } else {
      evaluations = [
        {
          score: 7,
          feedback: "Candidate completed the interview session.",
        },
      ];
    }
  }

  const evaluationResult = await finalEvaluationChain.invoke({
    role: state.role,
    evaluations: JSON.stringify(evaluations),
    dsaEvaluations: JSON.stringify(dsaEvaluations),
  });

  return { finalEvaluation: evaluationResult, phase: "finalization" };
};

module.exports = { FinalEvaluationNode };
