const { interrupt } = require("@langchain/langgraph");

const waitForCandidate = async (state) => {
  const answer = await interrupt({
    type: "wait_for_answer",
    interviewId: state.interviewId,
    roundNumber: state.currentRoundNumber,
    questionNumber: state.currentQuestionNumber,
    question: state.currentQuestion,
  });

  return { currentAnswer: answer, phase: "evaluation" };
};
module.exports = { waitForCandidate };
