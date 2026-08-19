const { pool } = require("../../config/db");

const getEvaluationResultsFromDB = async (interviewId) => {
  const query = `SELECT evaluations FROM interview_evaluations WHERE interview_id = $1;`;

  const values = [interviewId];

  const { rows } = await pool.query(query, values);

  return rows;
};

module.exports = { getEvaluationResultsFromDB };
