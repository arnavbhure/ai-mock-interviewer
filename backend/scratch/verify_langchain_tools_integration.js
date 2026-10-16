const assert = require("assert");
const { initializeCheckpointer } = require("../components/langgraph/config/checkpointer");
const { InterviewState, InterviewGraphAnnotation } = require("../components/langgraph/state/main_graph_state");
const { availableTools, interviewTools } = require("../components/langgraph/tools");
const { ToolNode } = require("@langchain/langgraph/prebuilt");
const { AIMessage, HumanMessage, ToolMessage, SystemMessage, RemoveMessage } = require("@langchain/core/messages");
const { StateGraph, START, END, interrupt } = require("@langchain/langgraph");

async function runVerification() {
  console.log("=== Step 1: Verify Available Tools Export ===");
  assert(Array.isArray(availableTools), "availableTools must be an array");
  assert(Array.isArray(interviewTools), "interviewTools must be an array");
  assert.strictEqual(availableTools.length, 3, "There should be 3 tools exported");
  assert.strictEqual(availableTools, interviewTools, "availableTools and interviewTools should be identical");
  const toolNames = availableTools.map((t) => t.name);
  console.log("Exported tool names:", toolNames);
  assert(toolNames.includes("get_resume_context"), "Must include get_resume_context");
  assert(toolNames.includes("tavily_search"), "Must include tavily_search");
  assert(toolNames.includes("fetch_all_dsa_questions_from_db"), "Must include fetch_all_dsa_questions_from_db");
  console.log("✓ Step 1 passed: Tools exported and verified.\n");

  console.log("=== Step 2: Verify InterviewState Zod and Annotation ===");
  const testStateData = {
    interviewId: "test-int-1",
    userId: "test-user-1",
    resumeId: "test-res-1",
    role: "Backend Engineer",
    interviewPlan: {
      interviewTitle: "Backend Engineering Mock Interview",
      role: "Backend Engineer",
      totalRounds: 1,
      totalQuestions: 1,
      estimatedDuration: 45,
      rounds: [
        {
          roundNumber: 1,
          roundType: "technical",
          displayName: "Technical Round",
          objective: "Assess backend proficiency",
          difficulty: "medium",
          numberOfQuestions: 1,
          topics: ["Node.js", "Databases"],
        },
      ],
    },
    currentRoundNumber: 1,
    currentQuestionNumber: 1,
    currentQuestion: null,
    currentAnswer: null,
    lastEvaluation: null,
    questionScores: [],
    resumeContext: [],
    currentDifficulty: "medium",
    conversationHistory: [],
    messages: [],
    phase: "initialization",
    status: "active",
    shouldContinue: true,
    error: null,
    retryCount: 0,
    finalEvaluation: null,
    stateVersion: 1,
  };

  const parsedZod = InterviewState.parse(testStateData);
  assert.strictEqual(parsedZod.interviewId, "test-int-1");
  assert.strictEqual(Array.isArray(parsedZod.messages), true);

  // Check Annotation channels
  const channels = Object.keys(InterviewGraphAnnotation.spec);
  console.log("Total annotation channels:", channels.length);
  assert(channels.includes("messages"), "Annotation must have messages channel");
  assert(channels.includes("interviewId"), "Annotation must have interviewId channel");
  assert(channels.includes("userId"), "Annotation must have userId channel");
  console.log("✓ Step 2 passed: InterviewState Zod and Annotation validated.\n");

  console.log("=== Step 3: Verify Main Graph Compilation and Routing ===");
  await initializeCheckpointer();
  const { main_graph, routeAfterQuestionGeneration } = require("../components/langgraph/graph/main_graph");
  assert(Boolean(main_graph), "main_graph should compile");
  assert.strictEqual(typeof routeAfterQuestionGeneration, "function");

  // Test routing with tool_calls
  const stateWithToolCalls = {
    messages: [
      new AIMessage({
        content: "",
        tool_calls: [{ id: "call_1", name: "get_resume_context", args: { query: "Node.js" } }],
      }),
    ],
  };
  assert.strictEqual(routeAfterQuestionGeneration(stateWithToolCalls), "tools");

  // Test routing with final response (no tool_calls)
  const stateWithFinalResponse = {
    messages: [
      new AIMessage({
        content: JSON.stringify({ question: "What is event loop?", questionType: "technical" }),
        tool_calls: [],
      }),
    ],
  };
  assert.strictEqual(routeAfterQuestionGeneration(stateWithFinalResponse), "wait_for_answer");

  // Test routing with empty messages
  assert.strictEqual(routeAfterQuestionGeneration({ messages: [] }), "wait_for_answer");
  console.log("✓ Step 3 passed: Graph compilation and routing logic verified.\n");

  console.log("=== Step 4: Simulate Full Tool Loop in Subgraph ===");
  let agentCalls = 0;
  const mockAgentNode = async (state) => {
    agentCalls++;
    const msgs = Array.isArray(state.messages) ? state.messages : [];
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    const isToolReturn = lastMsg != null && (lastMsg instanceof ToolMessage || lastMsg.tool_call_id != null);

    if (!isToolReturn) {
      // Step 1: Model requests a tool
      return {
        messages: [
          new AIMessage({
            content: "",
            tool_calls: [{ id: "mock_tc_1", name: "mock_dsa_tool", args: {} }],
          }),
        ],
        phase: "question_generation",
      };
    } else {
      // Step 2: Model received tool results, returns final question
      return {
        currentQuestion: {
          question: "How would you optimize database indexing?",
          questionType: "technical",
          focusArea: "Databases",
          expectedSkills: ["SQL", "Indexing"],
        },
        messages: [
          new AIMessage({
            content: '{"question": "How would you optimize database indexing?", "questionType": "technical"}',
            tool_calls: [],
          }),
        ],
        phase: "waiting_for_answer",
      };
    }
  };

  const { tool } = require("@langchain/core/tools");
  const { z } = require("zod");
  const mockDsaTool = tool(
    async () => JSON.stringify([{ id: 1, title: "LRU Cache", difficulty: "medium" }]),
    {
      name: "mock_dsa_tool",
      description: "Mock DSA tool",
      schema: z.object({}),
    }
  );

  const testWorkflow = new StateGraph(InterviewGraphAnnotation);
  testWorkflow.addNode("generate_question", mockAgentNode);
  testWorkflow.addNode("tools", new ToolNode([mockDsaTool]));
  testWorkflow.addNode("wait_for_answer", async (state) => {
    const ans = await interrupt({
      type: "wait_for_answer",
      question: state.currentQuestion,
    });
    return { currentAnswer: ans, phase: "evaluation" };
  });

  testWorkflow.addEdge(START, "generate_question");
  testWorkflow.addConditionalEdges("generate_question", routeAfterQuestionGeneration, {
    tools: "tools",
    wait_for_answer: "wait_for_answer",
  });
  testWorkflow.addEdge("tools", "generate_question");
  testWorkflow.addEdge("wait_for_answer", END);

  const { MemorySaver } = require("@langchain/langgraph");
  const memCheckpointer = new MemorySaver();
  const testGraph = testWorkflow.compile({ checkpointer: memCheckpointer });

  const runConfig = { configurable: { thread_id: "test-thread-1" } };
  const firstResult = await testGraph.invoke({ ...testStateData, messages: [] }, runConfig);

  console.log("Agent invocations during question generation:", agentCalls);
  assert.strictEqual(agentCalls, 2, "Agent should have been called twice (1 for tool request, 1 for final question)");
  assert(Boolean(firstResult.__interrupt__), "Graph should have interrupted at wait_for_answer");
  console.log("Interrupt payload question:", firstResult.__interrupt__[0].value.question.question);
  assert.strictEqual(firstResult.__interrupt__[0].value.question.question, "How would you optimize database indexing?");
  console.log("✓ Step 4 passed: Multi-turn tool execution loop and interrupt successfully tested.\n");

  console.log("=== Step 5: Simulate Candidate Resume After Interrupt ===");
  const { Command } = require("@langchain/langgraph");
  const resumeResult = await testGraph.invoke(
    new Command({ resume: "I use B-Tree indexes on frequently filtered columns and composite indexes for multi-column queries." }),
    runConfig
  );
  console.log("Resume phase:", resumeResult.phase);
  console.log("Candidate answer captured:", resumeResult.currentAnswer);
  assert.strictEqual(resumeResult.phase, "evaluation");
  assert(resumeResult.currentAnswer.includes("B-Tree"), "Candidate answer must be recorded in state");
  console.log("✓ Step 5 passed: Graph successfully resumed from interrupt with candidate answer.\n");

  console.log("ALL 5 VERIFICATION CHECKS PASSED PERFECTLY!");
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
