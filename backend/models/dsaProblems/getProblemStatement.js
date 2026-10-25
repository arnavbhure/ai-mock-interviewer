const { pool } = require("../../config/db");

const getProblemStatementDeatils = async (problemId) => {
  const query = "SELECT title , description , id FROM problems where id = $1";
  const values = [problemId];

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

module.exports = { getProblemStatementDeatils };
