const { StateGraph, START, END } = require("@langchain/langgraph");
const { InterviewState } = require("../state/main_graph_state");

const main_graph = new StateGraph(InterviewState);

module.exports = { main_graph };
