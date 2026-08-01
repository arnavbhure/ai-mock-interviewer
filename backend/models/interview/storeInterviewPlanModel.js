const pool = require("../../config/db");

const storeInterviewPlanModel = async (
  userId,
  interviewPlan,
  role,
  difficulty,
) => {
  const { rows } = await pool.query(
    `
    SELECT id
    FROM candidate_resumes
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId],
  );

  const resumeId = rows[0]?.id;

  if (!resumeId) {
    throw new Error("Resume not found.");
  }

  const query = `
    INSERT INTO interviews
    (
      user_id,
      resume_id,
      role,
      difficulty,
      interview_plan
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5
    )
    RETURNING *;
  `;

  const values = [userId, resumeId, role, difficulty, interviewPlan];

  const { rows: interviewRows } = await pool.query(query, values);

  return interviewRows[0];
};

module.exports = { storeInterviewPlanModel };
