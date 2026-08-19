const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");

const finalEvaluationPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`
You are an expert interviewer reviewing a completed interview.

Evaluate the candidate based only on the provided question-level evaluations.

Determine:
- overall performance score from 0 to 10
- hiring recommendation
- key strengths
- key weaknesses
- practical recommendations for improvement

Hiring recommendation must be exactly one of:

- Strong Hire: Exceptional performance with strong technical understanding and very few weaknesses.
- Hire: Good overall performance and demonstrates the required skills.
- Weak Hire: Some useful skills demonstrated, but there are noticeable gaps or inconsistent performance.
- No Hire: Significant gaps, incorrect understanding, or insufficient evidence of the required skills.

Base the hiring recommendation on the overall interview performance, not on a single answer.

Do not invent information that is not present in the evaluations.

Return only the structured evaluation.
`),

  HumanMessagePromptTemplate.fromTemplate(`
Role:
{role}

Interview Evaluations:
{evaluations}
`),
]);

module.exports = { finalEvaluationPrompt };
