const { pool } = require("../../config/db");

const getResumeModel = async (id) => {
  const query = `SELECT * FROM candidate_resumes WHERE user_id = ?`;
  const values = [id];

  const result = await pool.query(query, values);
  return result[0];
};

module.exports = { getResumeModel };
