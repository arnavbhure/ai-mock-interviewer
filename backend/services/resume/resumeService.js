const {
  cleanResumeText,
} = require("../../utils/resume/cleanResumeText.js.util");
const {
  extractResumeText,
} = require("../../utils/resume/extractResumeText.util");

const processResume = async (buffer) => {
  const rawText = await extractResumeText(buffer);

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("No readable text found in resume.");
  }

  const cleanText = cleanResumeText(rawText);

  return cleanText;
};

module.exports = { processResume };
