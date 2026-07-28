const { ChatOpenAI } = require("@langchain/openai");

const llm = new ChatOpenAI({
  model: process.env.OPENROUTER_MODEL,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: process.env.OPENROUTER_BASE_URL,
  },
  temperature: 0,
  maxRetries: 3,
});

module.exports = { llm };
