const { pool } = require("../../config/db");

/**
 * Updates an interview status to 'active' and records started_at if not already set.
 */
const updateInterviewToActive = async (interviewId) => {
  const query = `
    UPDATE interviews
    SET
      status = CASE WHEN status = 'completed' THEN 'completed' ELSE 'active'::interview_status END,
      started_at = COALESCE(started_at, NOW()),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, status, started_at;
  `;
  const { rows } = await pool.query(query, [interviewId]);
  return rows[0] || null;
};

/**
 * Updates an interview status to 'completed' and records completed_at timestamp.
 */
const updateInterviewToCompleted = async (interviewId) => {
  const query = `
    UPDATE interviews
    SET
      status = 'completed'::interview_status,
      completed_at = COALESCE(completed_at, NOW()),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, status, completed_at;
  `;
  const { rows } = await pool.query(query, [interviewId]);
  return rows[0] || null;
};

module.exports = {
  updateInterviewToActive,
  updateInterviewToCompleted,
};

