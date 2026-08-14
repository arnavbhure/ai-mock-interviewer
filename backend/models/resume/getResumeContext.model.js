const { pool } = require("../../config/db");

const getResumeContext = async (embedding, user_id) => {
  const query = `SELECT id,
    user_id,
    chunk_index , chunk_text , metadata,
    1 - (embedding <=> $1::vector) AS similarity
FROM resume_embeddings
WHERE user_id = $2
ORDER BY embedding <=> $1::vector
LIMIT 4;`;

  const values = [JSON.stringify(embedding), user_id];

  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = { getResumeContext };
