const routeAfterAdvance = (state) => {
  if (state.shouldContinue === false) {
    return "final_evaluation";
  }

  return "generate_question";
};

module.exports = { routeAfterAdvance };
