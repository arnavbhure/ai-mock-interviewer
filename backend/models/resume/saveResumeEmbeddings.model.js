const { pool } = require("../../config/db");

const saveResumeEmbeddingsModel = async (embeddings) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (!embeddings || embeddings.length === 0) {
      await client.query("COMMIT");

      return {
        stored: false,
        chunkCount: 0,
      };
    }

    const resumeId = embeddings[0].resume_id;

    // Remove old embeddings for this resume
    await client.query(
      `
        DELETE FROM resume_embeddings
        WHERE resume_id = $1
      `,
      [resumeId],
    );

    // Insert updated embeddings
    for (const chunk of embeddings) {
      const vector = `[${chunk.embedding.join(",")}]`;

      await client.query(
        `
          INSERT INTO resume_embeddings (
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
      resumeId,
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
