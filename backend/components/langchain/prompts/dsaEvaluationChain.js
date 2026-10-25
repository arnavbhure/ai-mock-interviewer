const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");

const dsaEvaluationPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`
You are a senior technical interviewer evaluating a candidate's DSA performance.
Evaluate their code, problem-solving ability, time and space complexity, and code quality using the provided problem details, code, and judge results.

Trust the backend judge verdict for correctness. Never invent test results.
If the candidate skipped the question, evaluate it as skipped without assuming their abilities.
Provide constructive, evidence-based feedback.

Return valid JSON containing: score (0-10), correctness, timeComplexity,
spaceComplexity, strengths, weaknesses, and feedback.
`),
  HumanMessagePromptTemplate.fromTemplate(`
Problem Title: {title}
Statement: {problemStatement}
Candidate's Code: {code}
Judge verdict: {judgeVerdict}
`),
]);

module.exports = { dsaEvaluationPrompt };
