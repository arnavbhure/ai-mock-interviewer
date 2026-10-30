const { pool } = require("../../config/db");

const dashboardStatsResultModel = async (userId) => {
  const query = `SELECT
    COUNT(i.id)::INTEGER AS total_interviews,

    COUNT(i.id) FILTER (
        WHERE i.status = 'completed'
    )::INTEGER AS completed_interviews,

    COUNT(i.id) FILTER (
        WHERE i.status = 'active'
    )::INTEGER AS active_interviews,

    COALESCE(
        ROUND(AVG(fe.overall_score), 2),
        0
    ) AS average_score,

    COUNT(fe.id) FILTER (
        WHERE fe.hire_chance = 'Strong Hire'
    )::INTEGER AS strong_hire_count

FROM interviews i
LEFT JOIN final_evaluations fe
    ON fe.interview_id = i.id

WHERE i.user_id = $1;`;

  const values = [userId];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { dashboardStatsResultModel };
