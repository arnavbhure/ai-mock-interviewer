const { pool } = require("../../config/db");

const saveFinalEvaluationToDB = async (interviewId, finalEvaluation) => {
  const query = `
  INSERT INTO final_evaluations (
    interview_id,
    overall_score,
    hire_chance,
    summary,
    strengths,
    weaknesses,
    recommendations
  )
  VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb)
  ON CONFLICT (interview_id)
  DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    hire_chance = EXCLUDED.hire_chance,
    summary = EXCLUDED.summary,
    strengths = EXCLUDED.strengths,
    weaknesses = EXCLUDED.weaknesses,
    recommendations = EXCLUDED.recommendations,
    updated_at = NOW()
  RETURNING *;
`;

  const values = [
    interviewId,
    finalEvaluation.overallScore,
    finalEvaluation.hireChance,
    finalEvaluation.summary,
    JSON.stringify(finalEvaluation.strengths),
    JSON.stringify(finalEvaluation.weaknesses),
    JSON.stringify(finalEvaluation.recommendations),
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

module.exports = { saveFinalEvaluationToDB };
