const { pool } = require("../../config/db");

const fetchAvailableQuestions = async () => {
  const query = ` SELECT id , title , difficulty , topics from problems;`;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { fetchAvailableQuestions };
