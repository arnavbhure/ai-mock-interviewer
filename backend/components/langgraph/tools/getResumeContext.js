const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const {
  generateEmbeddings,
} = require("../services/generateEmbeddings.service");

const {
  getResumeContext,
} = require("../../../models/resume/getResumeContext.model");

/*
 * Tool for retrieving relevant context from the
 * candidate's resume using semantic search.
 */

const getResumeContextTool = tool(
  async ({ query, limit }, runtime) => {
    const userId = runtime.state.userId;

    if (!userId) {
      throw new Error("User ID is not available in the runtime state.");
    }

    const queryEmbedding = await generateEmbeddings(query);

    const results = await getResumeContext(queryEmbedding, userId, limit);

    if (!results.length) {
      return {
        found: false,
        message: "No relevant information was found in the candidate's resume.",
        results: [],
      };
    }

    return {
      found: true,

      results: results.map((chunk) => ({
        chunkId: chunk.id,
        chunkIndex: chunk.chunk_index,
        content: chunk.chunk_text,
        similarity: Number(Number(chunk.similarity).toFixed(4)),
        metadata: chunk.metadata ?? {},
      })),
    };
  },
  {
    name: "get_resume_context",

    description: `
Retrieve relevant information from the candidate's resume using semantic search.

Use this tool when you need to verify or retrieve specific information
from the candidate's resume before generating an interview question.

Use this tool for information about:
- projects
- technologies
- programming languages
- frameworks
- libraries
- work experience
- internships
- education
- achievements
- responsibilities
- technical implementations
- architecture or design decisions
- specific claims made in the resume

Use this tool when the required resume information is not already
available in the current interview state or conversation history.

Do NOT use this tool for:
- general programming knowledge
- current or recently changed technical information
- information unrelated to the candidate's resume
- generating interview questions itself

The returned information comes directly from the candidate's resume.
Do not assume that a technology, project, skill, or experience exists
unless it is supported by the retrieved resume content.
`,

    schema: z.object({
      query: z
        .string()
        .min(2)
        .describe(
          "Specific information to retrieve from the candidate's resume. Example: 'technologies and architecture used in the CityLink project'",
        ),

      limit: z
        .number()
        .int()
        .min(1)
        .max(4)
        .default(4)
        .describe("Maximum number of relevant resume chunks to retrieve."),
    }),
  },
);

module.exports = { getResumeContextTool };
