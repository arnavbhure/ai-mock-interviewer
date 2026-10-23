const { resumeParserLLM, llmWithTools } = require("../../../config/llm");
const {
  GeneratedQuestionSchema,
} = require("../schema/questiongenerate.schema");
const {
  generateQuestionPrompt,
} = require("../prompts/questionGenerator.prompt");
const {
  ToolMessage,
  HumanMessage,
  RemoveMessage,
} = require("@langchain/core/messages");

/**
 * Format conversation history into clean conversational dialog
 * instead of raw escaped JSON.
 */
function formatConversationHistory(history) {
  if (!Array.isArray(history) || history.length === 0) {
    return "No previous conversation yet. This is the first question of the interview.";
  }
  return history
    .map((item) => {
      const role =
        item.role === "candidate" || item.role === "user"
          ? "Candidate"
          : "Interviewer";
      const content = (
        typeof item.content === "string"
          ? item.content
          : item.text || item.message || ""
      ).trim();
      return `${role}: ${content}`;
    })
    .filter((line) => line.length > 0)
    .join("\n\n");
}

/**
 * Format evaluations and recent scores into human-readable context.
 */
function formatEvaluationHistory(questionScores, lastEvaluation) {
  const sections = [];

  if (Array.isArray(questionScores) && questionScores.length > 0) {
    const scoreLines = questionScores.map((qs) => {
      const topic = qs.topic || "General";
      const diff = qs.difficulty || "medium";
      const score = qs.score !== undefined ? `${qs.score}/10` : "N/A";
      return `- Question ${qs.questionNumber} (${topic}, ${diff}): Score ${score}`;
    });
    sections.push(`Previous Question Scores:\n${scoreLines.join("\n")}`);
  }

  if (lastEvaluation) {
    const details = [];
    if (lastEvaluation.score !== undefined) {
      details.push(`Score: ${lastEvaluation.score}/10`);
    }
    if (lastEvaluation.feedback) {
      details.push(`Feedback: ${lastEvaluation.feedback}`);
    }
    if (
      Array.isArray(lastEvaluation.weaknesses) &&
      lastEvaluation.weaknesses.length > 0
    ) {
      details.push(
        `Weaknesses / areas to probe: ${lastEvaluation.weaknesses.join(", ")}`,
      );
    }
    if (
      Array.isArray(lastEvaluation.strengths) &&
      lastEvaluation.strengths.length > 0
    ) {
      details.push(`Strengths noted: ${lastEvaluation.strengths.join(", ")}`);
    }
    if (details.length > 0) {
      sections.push(`Latest Answer Evaluation:\n${details.join("\n")}`);
    }
  }

  return sections.length > 0
    ? sections.join("\n\n")
    : "No previous evaluations available.";
}

/**
 * Format relevant resume chunk excerpts.
 */
function formatResumeContext(resumeContext) {
  if (!Array.isArray(resumeContext) || resumeContext.length === 0) {
    return "No specific resume excerpts available.";
  }
  return resumeContext
    .map((chunk, idx) => {
      const text = typeof chunk === "string" ? chunk : chunk?.text || "";
      return `[Resume Excerpt ${idx + 1}]:\n${text.trim()}`;
    })
    .filter((s) => s.length > 0)
    .join("\n\n");
}

/**
 * Format resume data into concise summary text.
 */
function formatResume(resume) {
  if (!resume) return "Not provided.";
  if (typeof resume === "string") return resume.slice(0, 1500);
  if (typeof resume === "object") {
    const parts = [];
    if (resume.skills) {
      parts.push(
        `Skills: ${Array.isArray(resume.skills) ? resume.skills.join(", ") : resume.skills}`,
      );
    }
    if (resume.experience) {
      parts.push(
        `Experience: ${typeof resume.experience === "string" ? resume.experience : JSON.stringify(resume.experience)}`,
      );
    }
    if (resume.summary) {
      parts.push(`Summary: ${resume.summary}`);
    }
    if (parts.length > 0) return parts.join("\n");
    return JSON.stringify(resume).slice(0, 1500);
  }
  return String(resume);
}

/**
 * Helper to extract JSON from raw markdown or text responses.
 */
function extractAndParseJson(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // ignore
    }
  }
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0].trim());
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Contextual fallback generator when both initial invoke and retry fail.
 */
function getFallbackQuestion({
  role,
  roundType,
  currentQuestionNumber,
  focusAreas,
  lastEvaluation,
}) {
  const normRoundType = (roundType || "technical").toLowerCase();
  let questionText = "";
  let questionType = "technical";

  if (lastEvaluation?.weaknesses && lastEvaluation.weaknesses.length > 0) {
    const topicToProbe = lastEvaluation.weaknesses[0];
    questionText = `Could you elaborate further on how you would address ${topicToProbe} in a production ${role} system?`;
    questionType = "follow_up";
  } else if (
    normRoundType.includes("resume") ||
    normRoundType.includes("intro")
  ) {
    questionType = "introductory";
    if (currentQuestionNumber === 1) {
      questionText = `To begin, could you walk me through your background as a ${role} and highlight your primary technical accomplishments?`;
    } else {
      questionText = `In your recent projects, what was one of the most demanding engineering trade-offs you had to make, and what was the outcome?`;
    }
  } else if (
    normRoundType.includes("dsa") ||
    normRoundType.includes("problem")
  ) {
    questionType = "problem_solving";
    questionText = `Can you explain your methodology for analyzing and optimizing the time and space complexity of algorithms handling high-throughput data?`;
  } else if (normRoundType.includes("behavior")) {
    questionType = "behavioral";
    questionText = `Can you share a situation where you had to adapt quickly to changing technical requirements or tight deadlines?`;
  } else {
    questionType = "technical";
    if (focusAreas) {
      questionText = `Could you explain the best practices and common pitfalls when working with ${focusAreas} in a large-scale ${role} application?`;
    } else {
      questionText = `In your experience as a ${role}, how do you ensure high performance, testability, and maintainability across the system?`;
    }
  }

  const rawFallback = {
    question: questionText,
    questionType,
    focusArea: focusAreas || null,
    expectedSkills: [role],
  };

  return GeneratedQuestionSchema.parse(rawFallback);
}

const generateQuestionNode = async (state) => {
  const currentRound =
    state.interviewPlan?.rounds?.[state.currentRoundNumber - 1];

  if (!currentRound) {
    throw new Error(
      `Round ${state.currentRoundNumber} not found in interview plan.`,
    );
  }

  const focusAreasList = Array.isArray(currentRound.focusAreas)
    ? currentRound.focusAreas
    : Array.isArray(currentRound.topics)
      ? currentRound.topics
      : [];
  const focusAreas = focusAreasList.join(", ");

  const formattedConversationHistory = formatConversationHistory(
    state.conversationHistory,
  );
  const formattedEvaluationHistory = formatEvaluationHistory(
    state.questionScores,
    state.lastEvaluation,
  );
  const formattedResumeContext = formatResumeContext(state.resumeContext);
  const formattedResume = formatResume(state.resume);

  const chainInput = {
    role: state.role || "Software Engineer",
    roundType: currentRound.roundType || currentRound.type || "technical",
    currentRound: currentRound.displayName || "Technical Interview",
    objective:
      currentRound.objective || "Assess candidate technical capability",
    difficulty: state.currentDifficulty || "medium",
    roundDifficulty:
      currentRound.difficulty || state.currentDifficulty || "medium",
    focusAreas: focusAreas || "Core engineering principles",
    topics: focusAreas || "Core engineering principles",
    questionNumber: state.currentQuestionNumber,
    resume: formattedResume,
    resumeContext: formattedResumeContext,
    conversationHistory: formattedConversationHistory,
    evaluationHistory: formattedEvaluationHistory,
  };

  const messages = Array.isArray(state.messages) ? state.messages : [];
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  const isToolReturn =
    lastMessage != null &&
    (lastMessage instanceof ToolMessage ||
      lastMessage._getType?.() === "tool" ||
      lastMessage.tool_call_id != null ||
      lastMessage.constructor?.name === "ToolMessage");

  // Safeguard against infinite tool loops
  const toolMessageCount = messages.filter(
    (m) =>
      m instanceof ToolMessage ||
      m._getType?.() === "tool" ||
      m.tool_call_id != null ||
      m.constructor?.name === "ToolMessage",
  ).length;

  const MAX_TOOL_ITERATIONS = 5;
  const forceNoTools = isToolReturn && toolMessageCount >= MAX_TOOL_ITERATIONS;

  let messagesToSend;
  let promptMessages = null;

  if (isToolReturn) {
    if (forceNoTools) {
      console.warn(
        `[generateQuestionNode] Tool iteration limit (${MAX_TOOL_ITERATIONS}) reached. Forcing final question generation without further tools.`,
      );
      messagesToSend = [
        ...messages,
        new HumanMessage(
          "You have gathered sufficient context from the tools. Do not call any more tools. Respond with ONLY the final interview question JSON object now.",
        ),
      ];
    } else {
      messagesToSend = messages;
    }
  } else {
    promptMessages = await generateQuestionPrompt.formatMessages(chainInput);
    messagesToSend = promptMessages;
  }

  let response;
  try {
    if (forceNoTools) {
      response = await resumeParserLLM.invoke(messagesToSend);
    } else {
      response = await llmWithTools.invoke(messagesToSend);
    }
  } catch (llmErr) {
    console.warn(
      `[generateQuestionNode] LLM invocation failed: ${llmErr.message}. Falling back to default question.`,
    );
    const fallbackQuestion = getFallbackQuestion({
      role: state.role || "Software Engineer",
      roundType: currentRound.roundType || currentRound.type,
      currentQuestionNumber: state.currentQuestionNumber,
      focusAreas,
      lastEvaluation: state.lastEvaluation,
    });
    return {
      currentQuestion: fallbackQuestion,
      phase: "waiting_for_answer",
    };
  }

  const hasToolCalls =
    !forceNoTools &&
    Array.isArray(response?.tool_calls) &&
    response.tool_calls.length > 0;

  if (hasToolCalls) {
    const updatedMessages = !isToolReturn
      ? [
          new RemoveMessage({ id: "__remove_all__" }),
          ...promptMessages,
          response,
        ]
      : [response];

    return {
      messages: updatedMessages,
      phase: "question_generation",
    };
  }

  // Final question generation path (no tool calls)
  let questionResult = null;
  const rawText = typeof response?.content === "string" ? response.content : "";
  const parsedJson = extractAndParseJson(rawText);

  if (parsedJson && parsedJson.question) {
    try {
      questionResult = GeneratedQuestionSchema.parse(parsedJson);
    } catch (parseErr) {
      console.warn(
        `[generateQuestionNode] Schema validation failed: ${parseErr.message}. Retrying with direct completion...`,
      );
    }
  }

  // Attempt 2: If parsing failed, retry with direct completion
  if (!questionResult || !questionResult.question) {
    try {
      const retryPrompt = `You are an expert technical interviewer for a ${state.role || "Software Engineer"} position.
Current Round: ${currentRound.displayName || currentRound.roundType} (Focus: ${focusAreas || "general technical capability"}).
Question Number: ${state.currentQuestionNumber}.

Candidate background summary:
${formattedConversationHistory.slice(0, 500)}

Generate exactly ONE interview question.
Respond with ONLY a valid JSON object strictly matching:
{"question": "Your question text here", "questionType": "technical", "focusArea": null, "expectedSkills": []}
and if the candidate given answer give it cheer , good answer and if it is bad answer tell in one line feedback and then give next question,
And if it is the first round and first question, ensure the question is introductory and open-ended like introduce yourself like that dont jump directly into the real interveiw question. Do not include any extra text or explanation.
`;

      const retryResponse = await resumeParserLLM.invoke(retryPrompt);
      const retryText =
        typeof retryResponse?.content === "string" ? retryResponse.content : "";
      const retryParsed = extractAndParseJson(retryText);

      if (retryParsed && retryParsed.question) {
        questionResult = GeneratedQuestionSchema.parse(retryParsed);
      }
    } catch (retryErr) {
      console.warn(
        `[generateQuestionNode] Retry attempt failed: ${retryErr.message}.`,
      );
    }
  }

  // Attempt 3: Contextual fallback question guarantee (the graph NEVER crashes)
  if (!questionResult || !questionResult.question) {
    console.info(
      `[generateQuestionNode] Using contextual fallback question for round ${state.currentRoundNumber}, question ${state.currentQuestionNumber}.`,
    );
    questionResult = getFallbackQuestion({
      role: state.role || "Software Engineer",
      roundType: currentRound.roundType || currentRound.type,
      currentQuestionNumber: state.currentQuestionNumber,
      focusAreas,
      lastEvaluation: state.lastEvaluation,
    });
  }

  const updatedMessages = !isToolReturn
    ? [
        new RemoveMessage({ id: "__remove_all__" }),
        ...(promptMessages || []),
        response,
      ]
    : [response];

  return {
    currentQuestion: questionResult,
    messages: updatedMessages,
    phase: "waiting_for_answer",
  };
};

module.exports = { generateQuestionNode };
