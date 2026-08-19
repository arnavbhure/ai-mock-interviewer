const { RunnableSequence } = require("@langchain/core/runnables");
const { resumeParserLLM } = require("../../../config/llm");
const { FinalEvaluationSchema } = require("../schema/finalEvaluationSchema");
const { finalEvaluationPrompt } = require("../prompts/finalEvaluation.prompt");

const finalEvaluationLLM = resumeParserLLM.withStructuredOutput(
  FinalEvaluationSchema,
);

const finalEvaluationChain = RunnableSequence.from([
  finalEvaluationPrompt,
  finalEvaluationLLM,
]);

module.exports = { finalEvaluationChain };
