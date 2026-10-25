const { pool } = require("../../config/db");

const saveDsaEvaluationResultModel = async ({
  evaluation_result,
  interviewId,
  problemId,
}) => {
  const {
    score,
    correctness,
    timeComplexity,
    spaceComplexity,
    strengths,
    weaknesses,
    feedback,
  } = evaluation_result;
  const query = `INSERT INTO dsa_evaluations (interview_id , problem_id , score , correctness , time_complexity ,
   space_complexity , strengths , weaknesses , feedback) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

  const values = [
    interviewId,
    problemId,
    score,
    correctness,
    timeComplexity,
    spaceComplexity,
    JSON.stringify(strengths ?? []),
    JSON.stringify(weaknesses ?? []),
    feedback,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { saveDsaEvaluationResultModel };
