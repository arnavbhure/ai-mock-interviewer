const { main_graph } = require("../../components/langgraph/graph/main_graph");
const {
  initialState,
} = require("../../components/langgraph/state/intialise_state");

const startInterviewService = async (interview) => {
  if (!interview?.id) {
    throw new Error("Interview ID is required.");
  }

  if (!interview?.user_id) {
    throw new Error("User ID is required.");
  }

  const state = initialState(interview);

  const config = {
    configurable: {
      thread_id: interview.id,
    },
  };

  const result = await main_graph.invoke(state, config);

  return {
    result,
    threadId: interview.id,
    interrupted: Boolean(result.__interrupt__),
  };
};

module.exports = { startInterviewService };
