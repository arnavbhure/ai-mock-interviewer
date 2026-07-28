const { RunnableParallel } = require("@langchain/core/runnables");
const { ResumeParserChain } = require("./resumeParserChain");
const { ResumeEmbeddingChain } = require("./ResumeEmbeddingChain");

const ResumePreprocessingChain = RunnableParallel.from({
  structuredResume: ResumeParserChain,
  embeddings: ResumeEmbeddingChain,
});

module.exports = {
  ResumePreprocessingChain,
};
