const getInterviewStats = async (userId) => {
  const query = `SELECT
    i.id,
    i.role,
    i.status,
    i.difficulty,
    i.created_at,
    fe.overall_score,
    fe.hire_chance

FROM interviews i

LEFT JOIN final_evaluations fe
    ON fe.interview_id = i.id

WHERE i.user_id = $1

ORDER BY i.created_at DESC

LIMIT 5;`;

  const values = [userId];

  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = { getInterviewStats };
