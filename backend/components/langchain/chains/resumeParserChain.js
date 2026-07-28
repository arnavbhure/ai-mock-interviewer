const { RunnableSequence } = require("@langchain/core/runnables");
const { resumeParserLLM } = require("../../../config/llm");
const { resumeParserPrompt } = require("../prompts/resumeParser.prompt");
const { ResumeSchema } = require("../schemas/resume.schema");

const structuredLLM = resumeParserLLM.withStructuredOutput(ResumeSchema);

const ResumeParserChain = RunnableSequence.from([
  resumeParserPrompt,
  structuredLLM,
]);

module.exports = { ResumeParserChain };
