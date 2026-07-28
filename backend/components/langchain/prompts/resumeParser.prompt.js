const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");

const resumeParserPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`
You are an expert resume parser.

Your task is to extract structured information from the provided resume.

Instructions:
- Extract information exactly as it appears in the resume.
- Do not infer or hallucinate any details.
- If a field is missing, return null or an empty array as appropriate.
- Preserve the original wording whenever possible.
- Follow the provided output schema exactly.
- Do not include any explanation or additional text.
`),

  HumanMessagePromptTemplate.fromTemplate(`
Parse the following resume and extract its structured information.

Resume:

{resume}
`),
]);

module.exports = { resumeParserPrompt };
