const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const resumeSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

module.exports = { resumeSplitter };
