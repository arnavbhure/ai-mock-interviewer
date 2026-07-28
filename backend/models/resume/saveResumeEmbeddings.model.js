const saveResumeEmbeddingsModel = async (embeddings) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const chunk of embeddings) {
      await client.query(
        `
        INSERT INTO resume_embeddings
        (
          chunk_index,
          chunk_text,
          embedding,
          metadata
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          chunk.chunkIndex,
          chunk.text,
          chunk.embedding,
          JSON.stringify(chunk.metadata),
        ],
      );
    }

    await client.query("COMMIT");

    return {
      stored: true,
      chunkCount: embeddings.length,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { saveResumeEmbeddingsModel };
