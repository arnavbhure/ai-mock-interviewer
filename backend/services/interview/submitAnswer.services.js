const { Command } = require("@langchain/langgraph");
const { main_graph } = require("../../components/langgraph/graph/main_graph");

const submitAnswerService = async (interviewId, answer) => {
  if (!interviewId) {
    throw new Error("Interview ID is required.");
  }

  if (!answer || !answer.trim()) {
    throw new Error("Candidate answer is required.");
  }

  const config = {
    configurable: {
      thread_id: interviewId,
    },
  };

  const result = await main_graph.invoke(
    new Command({
      resume: answer.trim(),
    }),
    config,
  );

  return {
    result,
    threadId: interviewId,
    interrupted: Boolean(result.__interrupt__),
  };
};

module.exports = { submitAnswerService };
