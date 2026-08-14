const { getResumeContextTool } = require("./getResumeContext");
const { webSearchTool } = require("./webSearch.tool");

const interviewTools = [getResumeContextTool, webSearchTool];

module.exports = { interviewTools };
