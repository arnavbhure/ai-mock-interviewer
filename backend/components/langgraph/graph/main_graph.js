const { StateGraph, START, END } = require("@langchain/langgraph");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const {
  InterviewState,
  InterviewGraphAnnotation,
} = require("../state/main_graph_state");
const { availableTools } = require("../tools");
const { generateQuestionNode } = require("../nodes/generateQuestion.node");
const { waitForCandidate } = require("../nodes/waitForCandidate");
const { evaluateAnswerNode } = require("../nodes/evaluateAnswer.node");
const { advanceInterviewNode } = require("../nodes/advanceInterview.node");
const { FinalEvaluationNode } = require("../nodes/finalEvaluation.node");
const {
  routeAfterAdvance,
  routeInitialRound,
} = require("../utils/routeAfterAdvance");
const { checkpointerProxy } = require("../config/checkpointer");
const { dsaRoundNode } = require("../nodes/dsaRoundNode");

const workflow = new StateGraph(InterviewGraphAnnotation);

/**
 * Route after question generation:
 * - If model generated tool calls -> route to 'tools'
 * - If model generated final question -> route to 'wait_for_answer'
 */
const routeAfterQuestionGeneration = (state) => {
  const messages = state?.messages;
  if (Array.isArray(messages) && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      Array.isArray(lastMessage.tool_calls) &&
      lastMessage.tool_calls.length > 0
    ) {
      return "tools";
    }
  }
  return "wait_for_answer";
};

// Adding nodes
workflow.addNode("generate_question", generateQuestionNode);
workflow.addNode("dsa_round_node", dsaRoundNode);
workflow.addNode("tools", new ToolNode(availableTools));
workflow.addNode("wait_for_answer", waitForCandidate);
workflow.addNode("evaluate_answer", evaluateAnswerNode);
workflow.addNode("advance_interview", advanceInterviewNode);
workflow.addNode("final_evaluation", FinalEvaluationNode);

// Adding edges
workflow.addConditionalEdges(START, routeInitialRound, {
  dsa_round_node: "dsa_round_node",
  generate_question: "generate_question",
});

// Conditional routing from generate_question:
// Either into the tool execution loop or to candidate wait interrupt
workflow.addConditionalEdges(
  "generate_question",
  routeAfterQuestionGeneration,
  {
    tools: "tools",
    wait_for_answer: "wait_for_answer",
  },
);

// Tool results loop back into question generator
workflow.addEdge("tools", "generate_question");

// Candidate interaction & evaluation lifecycle
workflow.addEdge("wait_for_answer", "evaluate_answer");
workflow.addEdge("evaluate_answer", "advance_interview");
workflow.addConditionalEdges("advance_interview", routeAfterAdvance, {
  final_evaluation: "final_evaluation",
  dsa_round_node: "dsa_round_node",
  generate_question: "generate_question",
});
workflow.addEdge("dsa_round_node", "advance_interview");
workflow.addEdge("final_evaluation", END);

const main_graph = workflow.compile({ checkpointer: checkpointerProxy });

module.exports = { main_graph, routeAfterQuestionGeneration };
