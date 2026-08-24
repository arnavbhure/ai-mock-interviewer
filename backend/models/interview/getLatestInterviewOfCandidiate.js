const { pool } = require("../../config/db");

const getLatestInterviewByUserId = async (userId) => {
  const query = `    
    SELECT
      id,
      user_id,
      resume_id,
      status,
      created_at
    FROM interviews
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `;

  const values = [userId];

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

module.exports = { getLatestInterviewByUserId };
