const { pool } = require("../../config/db");

const getProblemStatementDeatils = async (problemId) => {
  const query =
    "SELECT title, description, id, public_tests_source FROM problems WHERE id = $1";
  const values = [problemId];

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
};

module.exports = { getProblemStatementDeatils };
