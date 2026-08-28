const { pool } = require("../../config/db");

const saveResumeEmbeddingsModel = async (embeddings) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const chunk of embeddings) {
      const vector = `[${chunk.embedding.join(",")}]`;

      await client.query(
        `
        INSERT INTO resume_embeddings
        (
          resume_id,
          chunk_index,
          chunk_text,
          embedding,
          metadata,
          user_id
        )
        VALUES ($1, $2, $3, $4::vector, $5, $6)
        `,
        [
          chunk.resume_id,
          chunk.chunkIndex,
          chunk.text,
          vector,
          JSON.stringify(chunk.metadata),
          chunk.user_id,
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
