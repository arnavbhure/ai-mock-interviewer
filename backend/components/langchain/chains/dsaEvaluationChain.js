const { RunnableSequence } = require("@langchain/core/runnables");
const { resumeParserLLM } = require("../../../config/llm");
const { dsaEvaluationPrompt } = require("../prompts/dsaEvaluationChain");
const { dsaEvaluationSchema } = require("../schemas/dsaEvaluationSchema");

const structured_llm =
  resumeParserLLM.withStructuredOutput(dsaEvaluationSchema);

const dsaEvaluationChain = RunnableSequence.from([
  dsaEvaluationPrompt,
  structured_llm,
]);

module.exports = { dsaEvaluationChain };
