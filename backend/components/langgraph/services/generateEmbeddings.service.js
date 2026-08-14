const { embeddingModel } = require("../../../config/llm");

const generateEmbeddings = async (text) => {
  const response = await embeddingModel.embedQuery(text);
  return response;
};

module.exports = { generateEmbeddings };
