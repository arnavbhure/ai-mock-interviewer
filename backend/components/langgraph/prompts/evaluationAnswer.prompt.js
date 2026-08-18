const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");

const evaluateAnswerPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`
You are an expert technical interviewer.

Evaluate the candidate's answer to the given interview question.

Score the answer from 0 to 10 based on:
- correctness
- technical understanding
- depth of reasoning
- relevance to the question

Consider the question difficulty when scoring.

Do not assume knowledge the candidate did not demonstrate.
Do not generate another question.
Return only the structured evaluation.
`),

  HumanMessagePromptTemplate.fromTemplate(`
Role: {role}

Round: {roundType}

Difficulty: {difficulty}

Question:
{question}

Candidate Answer:
{answer}
`),
]);

module.exports = { evaluateAnswerPrompt };
