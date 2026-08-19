const { pool } = require("../../config/db");

const appendInterviewEvaluationModel = async (interviewId, evaluation) => {
  const query = `
    INSERT INTO interview_evaluations (
      interview_id,
      evaluations
    )
    VALUES (
      $1,
      jsonb_build_array($2::jsonb)
    )

    ON CONFLICT (interview_id)
    DO UPDATE
    SET
      evaluations =
        interview_evaluations.evaluations
        || EXCLUDED.evaluations,

      updated_at = now()

    RETURNING *;
  `;

  const values = [interviewId, JSON.stringify(evaluation)];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = { appendInterviewEvaluationModel };
