const { StateGraph, START, END } = require("@langchain/langgraph");
const { InterviewState } = require("../state/main_graph_state");
const { generateQuestionNode } = require("../nodes/generateQuestion.node");
const { waitForCandidate } = require("../nodes/waitForCandidate");
const { evaluateAnswerNode } = require("../nodes/evaluateAnswer.node");
const { advanceInterviewNode } = require("../nodes/advanceInterview.node");

const workflow = new StateGraph(InterviewState);

//adding nodes here
workflow.addNode("generate_question", generateQuestionNode);
workflow.addNode("wait_for_answer", waitForCandidate);
workflow.addNode("evaluate_answer", evaluateAnswerNode);
workflow.addNode("advance_interview", advanceInterviewNode);

//adding edges here
workflow.addEdge(START, "generate_question");
workflow.addEdge("generate_question", "wait_for_answer");
workflow.addEdge("wait_for_answer", "evaluate_answer");
workflow.addEdge("evaluate_answer", "advance_interview");
workflow.addEdge("advance_interview", END);

module.exports = { workflow };
