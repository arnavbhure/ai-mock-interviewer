const {
  fetchAllDsaQuestionFromDBTool,
} = require("./fetchAllDsaQuestionFromDB");
const { getResumeContextTool } = require("./getResumeContext");
//const { webSearchTool } = require("./webSearch.tool");

const interviewTools = [
  getResumeContextTool,
  //webSearchTool,
  fetchAllDsaQuestionFromDBTool,
];

const availableTools = interviewTools;

module.exports = { interviewTools, availableTools };
