const {
  fetchAvailableQuestions,
} = require("../../../models/dsaProblems/fetchAvailableQuestions");
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const fetchAllDsaQuestionFromDBTool = tool(
  async () => {
    const questions = await fetchAvailableQuestions();
    return JSON.stringify(questions);
  },
  {
    name: "fetch_all_dsa_questions_from_db",
    description:
      "Fetches all the available DSA questions from the database. Returns a JSON string of the questions. Use only when the dsa round is going on and you want to see which question can u ask the user.",
    inputSchema: z.object({}),
  },
);

module.exports = { fetchAllDsaQuestionFromDBTool };
