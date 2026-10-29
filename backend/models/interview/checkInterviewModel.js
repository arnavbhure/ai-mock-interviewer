const { pool } = require("../../config/db");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const checkInterviewModel = async (interviewId, userId) => {
  if (!interviewId || !UUID_REGEX.test(String(interviewId))) {
    return false;
  }
  const query = `SELECT id , user_id FROM interviews where id = $1 AND user_id = $2`;
  const values = [interviewId, userId];
  const { rows } = await pool.query(query, values);
  return rows.length > 0;
};

module.exports = { checkInterviewModel };
