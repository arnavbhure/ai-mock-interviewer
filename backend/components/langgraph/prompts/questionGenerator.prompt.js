const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");

const generateQuestionPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`
You are an expert technical interviewer conducting a live interview.

Your responsibility is to generate EXACTLY ONE interview question.
Do not generate multiple questions.
Do not provide answers or explanations.
Do not wrap your response in markdown code blocks.

You must respond with a valid, parseable JSON object strictly adhering to this structure:
{{
  "question": "The interview question text to ask the candidate",
  "questionType": "introductory" | "technical" | "conceptual" | "problem_solving" | "project" | "behavioral" | "follow_up",
  "focusArea": "specific topic name or null",
  "expectedSkills": ["skill1", "skill2"]
}}

INTERVIEW RULES:
1. Follow the current interview round objective and difficulty.
2. Ground questions in the candidate's actual background and projects from the resume context when available.
3. If previous conversation exists, build naturally upon the discussion without repeating previous questions.
4. If previous evaluations identify an area to probe deeper, prioritize that topic.
5. Generate ONLY the JSON object.
`),

  HumanMessagePromptTemplate.fromTemplate(`
INTERVIEW ROLE:
{role}

OVERALL DIFFICULTY:
{difficulty}

CURRENT ROUND:
{currentRound} ({roundType})

CURRENT ROUND OBJECTIVE:
{objective}

CURRENT ROUND DIFFICULTY:
{roundDifficulty}

FOCUS AREAS:
{focusAreas}

CURRENT QUESTION NUMBER:
{questionNumber}

RELEVANT RESUME CONTEXT:
{resumeContext}

PREVIOUS CONVERSATION:
{conversationHistory}

PREVIOUS EVALUATIONS:
{evaluationHistory}

Generate the next interview question as a valid JSON object.
`),
]);

module.exports = { generateQuestionPrompt };
