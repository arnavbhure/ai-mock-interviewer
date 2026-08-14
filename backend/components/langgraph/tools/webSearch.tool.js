const { TavilySearch } = require("@langchain/tavily");

const webSearchTool = new TavilySearch({
  description: `Search the public web for current or specialized technical
information that may help formulate an interview question.

Use this tool when:
- the question requires information not available in the resume
- current technology information is relevant
- a company-specific technology or practice needs verification

Do NOT use this tool for:
- retrieving candidate information
- retrieving previous interview answers
- generic interview questions
- information already available in the interview state`,

  maxResults: 4,
  topic: "general",
});

module.exports = { webSearchTool };
