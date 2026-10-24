const { pool } = require("../../config/db");

const checkInterviewModel = async (interviewId, userId) => {
  const query = `SELECT id , user_id FROM interviews where id = $1 AND user_id = $2`;
  const values = [interviewId, userId];
  const { rows } = await pool.query(query, values);
  return rows.length > 0;
};

module.exports = { checkInterviewModel };
