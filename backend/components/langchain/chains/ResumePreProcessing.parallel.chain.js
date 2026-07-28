const { RunnableParallel } = require("@langchain/core/runnables");
const { ResumeParserChain } = require("./resumeParserChain");
const { ResumeEmbeddingChain } = require("./ResumeEmbeddingChain");

/*  this chain will run the ResumeParserChain and ResumeEmbeddingChain in parallel and return the results as an object with the following structure:
  {
    structuredResume: result from ResumeParserChain,
    embeddings: result from ResumeEmbeddingChain
  }
*/
const ResumePreprocessingChain = RunnableParallel.from({
  structuredResume: ResumeParserChain,
  embeddings: ResumeEmbeddingChain,
});

module.exports = {
  ResumePreprocessingChain,
};
