const getInterviewPlanModel = async (userId) => {
  const query = `
    SELECT interview_plan
    FROM interviews
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows[0] || null;
};

module.exports = { getInterviewPlanModel };
