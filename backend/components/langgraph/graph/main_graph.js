const { StateGraph, START, END } = require("@langchain/langgraph");
const { InterviewState } = require("../state/main_graph_state");
const { generateQuestionNode } = require("../nodes/generateQuestion.node");
const { waitForCandidate } = require("../nodes/waitForCandidate");
const { evaluateAnswerNode } = require("../nodes/evaluateAnswer.node");
const { advanceInterviewNode } = require("../nodes/advanceInterview.node");

const workflow = new StateGraph(InterviewState);

workflow.addNode("generate_question", generateQuestionNode);
workflow.addNode("wait_for_answer", waitForCandidate);
workflow.addNode("evaluate_answer", evaluateAnswerNode);
workflow.addNode("advance_interview", advanceInterviewNode);

module.exports = { workflow };
