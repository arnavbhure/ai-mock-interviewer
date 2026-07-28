const {
  RunnableSequence,
  RunnableLambda,
} = require("@langchain/core/runnables");
const { embeddingModel } = require("../../../config/llm");
const { resumeSplitter } = require("../splitters/resume.splitter");

const SplitResumeRunnable = RunnableLambda.from(async ({ resume }) => {
  const chunks = await resumeSplitter.createDocuments([resume]);
  return {
    chunks,
  };
});

const GenerateEmbeddingsRunnable = RunnableLambda.from(async ({ chunks }) => {
  const vectors = await embeddingModel.embedDocuments(
    chunks.map((chunk) => chunk.pageContent),
  );
  return {
    chunks,
    vectors,
  };
});

const FormatEmbeddingsRunnable = RunnableLambda.from(
  async ({ chunks, vectors }) => {
    return chunks.map((chunk, index) => ({
      text: chunk.pageContent,
      embedding: vectors[index],
      metadata: chunk.metadata,
    }));
  },
);

const ResumeEmbeddingChain = RunnableSequence.from([
  SplitResumeRunnable,
  GenerateEmbeddingsRunnable,
  FormatEmbeddingsRunnable,
]);

module.exports = {
  ResumeEmbeddingChain,
};
