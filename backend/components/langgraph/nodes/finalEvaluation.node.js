const {
  getEvaluationResultsFromDB,
} = require("../../../models/evaluation/getEvaluationResultsFromDB.model");
const { finalEvaluationChain } = require("../chains/finalEvaluation.chain");

const FinalEvaluationNode = async (state) => {
  const evaluationResultsFromDB = await getEvaluationResultsFromDB(
    state.interviewId,
  );

  if (!evaluationResultsFromDB.length) {
    throw new Error("Cannot generate final evaluation: no evaluations found.");
  }

  const evaluationResult = await finalEvaluationChain.invoke({
    role: state.role,
    evaluations: JSON.stringify(evaluationResultsFromDB),
  });

  return { evaluationResult, phase: "finalization" };
};

module.exports = { FinalEvaluationNode };
