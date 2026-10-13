const { RunnableSequence } = require("@langchain/core/runnables");
const { AnswerEvaluationSchema } = require("../schema/answerEvaluationSchema");
const { resumeParserLLM } = require("../../../config/llm");
const { evaluateAnswerPrompt } = require("../prompts/evaluationAnswer.prompt");

const structured_llm = resumeParserLLM.withStructuredOutput(
  AnswerEvaluationSchema,
  { method: "jsonMode" }
);

const EvaluationAnswerChain = RunnableSequence.from([
  evaluateAnswerPrompt,
  structured_llm,
]);

module.exports = { EvaluationAnswerChain };
