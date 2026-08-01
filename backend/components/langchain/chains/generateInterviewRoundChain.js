const { RunnableSequence } = require("@langchain/core/runnables");
const {
  generateInterviewRoundPrompt,
} = require("../prompts/generateInterviewRound.prompt");
const { resumeParserLLM } = require("../../../config/llm");
const { InterviewPlanSchema } = require("../schemas/interviewPlan.schema");

const structured_llm =
  resumeParserLLM.withStructuredOutput(InterviewPlanSchema);

const generateInterviewRoundChain = RunnableSequence.from([
  generateInterviewRoundPrompt,
  structured_llm,
]);

module.exports = { generateInterviewRoundChain };
