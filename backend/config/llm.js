const { ChatOpenAI } = require("@langchain/openai");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { interviewTools } = require("../components/langgraph/tools");
require("dotenv").config({ path: ".env" });

const resumeParserLLM = new ChatOpenAI({
  model: process.env.OPENROUTER_MODEL,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: process.env.OPENROUTER_BASE_URL,
  },
  temperature: 0,
  maxRetries: 3,
});

const llmWithTools = resumeParserLLM.bindTools(interviewTools);

const embeddingModel = new OpenAIEmbeddings({
  model: process.env.EMBEDDING_MODEL,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: process.env.OPENROUTER_BASE_URL,
  },
  encodingFormat: "float",
});

module.exports = { resumeParserLLM, embeddingModel, llmWithTools };
