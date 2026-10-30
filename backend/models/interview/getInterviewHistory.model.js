const { pool } = require("../../config/db");

/**
 * Retrieves the full interview history for a user in a single database query.
 * Joins interviews with final_evaluations to include scoring and hire decision.
 */
const getInterviewHistoryModel = async (userId) => {
  const query = `
    SELECT
      i.id,
      i.role,
      i.difficulty,
      i.status,
      i.created_at,
      i.started_at,
      i.completed_at,
      fe.overall_score,
      fe.hire_chance,
      fe.summary
    FROM interviews i
    LEFT JOIN final_evaluations fe ON fe.interview_id = i.id
    WHERE i.user_id = $1
    ORDER BY i.created_at DESC;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    difficulty: row.difficulty,
    status: row.status,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    overallScore:
      row.overall_score !== null && row.overall_score !== undefined
        ? Number(row.overall_score)
        : null,
    hireChance: row.hire_chance || null,
    summary: row.summary || null,
  }));
};

module.exports = { getInterviewHistoryModel };

