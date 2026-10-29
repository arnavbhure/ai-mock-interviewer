const { pool } = require("../../config/db");

const getDSAEvaluationsFromDBmodel = async (interviewId) => {
  const query = `SELECt id , interview_id , score , correctness , time_complexity , space_complexity ,
        strengths , weaknesses ,feedback
    FROM dsa_evaluations where interview_id = $1`;
  const values = [interviewId];

  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = { getDSAEvaluationsFromDBmodel };
