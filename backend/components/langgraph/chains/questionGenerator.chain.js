const { RunnableSequence } = require("@langchain/core/runnables");
const { resumeParserLLM } = require("../../../config/llm");
const {
  GeneratedQuestionSchema,
} = require("../schema/questiongenerate.schema");
const {
  generateQuestionPrompt,
} = require("../prompts/questionGenerator.prompt");

const structuredLLM = resumeParserLLM.withStructuredOutput(
  GeneratedQuestionSchema,
  { method: "jsonMode" }
);

const QuestionGeneratorChain = RunnableSequence.from([
  generateQuestionPrompt,
  structuredLLM,
]);

module.exports = { QuestionGeneratorChain };
