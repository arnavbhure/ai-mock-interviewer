const routeAfterAdvance = (state) => {
  if (state.shouldContinue === false) {
    return "final_evaluation";
  }

  const currentRound = state.interviewPlan.rounds[state.currentRoundNumber - 1];

  if (!currentRound) {
    throw new Error(`Round not found: ${state.currentRoundNumber}`);
  }

  return currentRound.roundType === "dsa"
    ? "dsa_round_node"
    : "generate_question";
};

const routeInitialRound = (state) => {
  const roundIdx = (state.currentRoundNumber || 1) - 1;
  const currentRound =
    state.interviewPlan?.rounds?.[roundIdx] || state.interviewPlan?.rounds?.[0];

  if (!currentRound) {
    throw new Error("Interview plan has no rounds.");
  }

  return currentRound.roundType === "dsa"
    ? "dsa_round_node"
    : "generate_question";
};

module.exports = { routeAfterAdvance, routeInitialRound };
