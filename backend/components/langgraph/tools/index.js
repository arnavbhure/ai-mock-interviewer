const {
  fetchAllDsaQuestionFromDBTool,
} = require("./fetchAllDsaQuestionFromDB");
const { getResumeContextTool } = require("./getResumeContext");
const { webSearchTool } = require("./webSearch.tool");

const interviewTools = [
  getResumeContextTool,
  webSearchTool,
  fetchAllDsaQuestionFromDBTool,
];

module.exports = { interviewTools };
