const { QuestionGeneratorChain } = require("../chains/questionGenerator.chain");
const { resumeParserLLM } = require("../../../config/llm");
const {
  GeneratedQuestionSchema,
} = require("../schema/questiongenerate.schema");

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
      const content =
        (typeof item.content === "string"
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
      details.push(
        `Strengths noted: ${lastEvaluation.strengths.join(", ")}`,
      );
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
      const text =
        typeof chunk === "string" ? chunk : chunk?.text || "";
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
  } else if (normRoundType.includes("resume") || normRoundType.includes("intro")) {
    questionType = "introductory";
    if (currentQuestionNumber === 1) {
      questionText = `To begin, could you walk me through your background as a ${role} and highlight your primary technical accomplishments?`;
    } else {
      questionText = `In your recent projects, what was one of the most demanding engineering trade-offs you had to make, and what was the outcome?`;
    }
  } else if (normRoundType.includes("dsa") || normRoundType.includes("problem")) {
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

  let questionResult = null;

  // Attempt 1: Invoke QuestionGeneratorChain with jsonMode
  try {
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

    questionResult = await QuestionGeneratorChain.invoke(chainInput);

    if (
      !questionResult?.question ||
      typeof questionResult.question !== "string" ||
      questionResult.question.trim().length === 0
    ) {
      throw new Error("Generated question was empty or missing question text.");
    }
  } catch (err) {
    console.warn(
      `[generateQuestionNode] Initial generation failed: ${err.message}. Retrying with direct fallback...`,
    );

    // Attempt 2: Direct prompt completion retry with JSON parser
    try {
      const retryPrompt = `You are an expert technical interviewer for a ${state.role || "Software Engineer"} position.
Current Round: ${currentRound.displayName || currentRound.roundType} (Focus: ${focusAreas || "general technical capability"}).
Question Number: ${state.currentQuestionNumber}.

Candidate background summary:
${formattedConversationHistory.slice(0, 500)}

Generate exactly ONE interview question.
Respond with ONLY a valid JSON object strictly matching:
{"question": "Your question text here", "questionType": "technical", "focusArea": null, "expectedSkills": []}`;

      const rawResponse = await resumeParserLLM.invoke(retryPrompt);
      const rawText =
        typeof rawResponse?.content === "string" ? rawResponse.content : "";
      const parsedJson = extractAndParseJson(rawText);

      if (parsedJson && parsedJson.question) {
        questionResult = GeneratedQuestionSchema.parse(parsedJson);
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

  return {
    currentQuestion: questionResult,
    phase: "waiting_for_answer",
  };
};

module.exports = { generateQuestionNode };

