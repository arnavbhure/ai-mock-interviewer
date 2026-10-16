let embeddingModel = null;
function getEmbeddingModel() {
  if (!embeddingModel) {
    const llm = require("../../../config/llm");
    embeddingModel = llm.embeddingModel;
  }
  return embeddingModel;
}

const generateEmbeddings = async (text) => {
  const model = getEmbeddingModel();
  const response = await model.embedQuery(text);
  return response;
};

module.exports = { generateEmbeddings };
