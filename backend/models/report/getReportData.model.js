const { pool } = require("../../config/db");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieves full performance report for an interview using at most 2 database queries.
 * Query 1: Fetches the target interview, final evaluation, question evaluations, and user's completed interviews list.
 * Query 2: Fetches DSA problem evaluations with problem titles.
 */
const getReportDataModel = async (userId, targetInterviewId) => {
  const validInterviewId =
    targetInterviewId && UUID_REGEX.test(targetInterviewId)
      ? targetInterviewId
      : null;

  // Query 1: Fetch interview + final_evaluations + interview_evaluations + completed interviews list
  const interviewQuery = `
    SELECT
      i.id,
      i.role,
      i.difficulty,
      i.status,
      i.created_at,
      i.completed_at,
      fe.overall_score,
      fe.hire_chance,
      fe.summary,
      fe.strengths AS strengths,
      fe.weaknesses AS weaknesses,
      fe.recommendations AS recommendations,
      ie.evaluations AS question_evaluations,
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'id', ci.id,
              'role', ci.role,
              'difficulty', ci.difficulty,
              'createdAt', ci.created_at,
              'score', cfe.overall_score,
              'hireChance', cfe.hire_chance
            )
            ORDER BY ci.created_at DESC
          ),
          '[]'::json
        )
        FROM interviews ci
        LEFT JOIN final_evaluations cfe ON cfe.interview_id = ci.id
        WHERE ci.user_id = $1 AND (ci.status = 'completed' OR cfe.id IS NOT NULL)
      ) AS available_interviews
    FROM interviews i
    LEFT JOIN final_evaluations fe ON fe.interview_id = i.id
    LEFT JOIN interview_evaluations ie ON ie.interview_id = i.id
    WHERE i.user_id = $1
      AND (
        ($2::uuid IS NULL AND (i.status = 'completed' OR fe.id IS NOT NULL))
        OR i.id = $2::uuid
      )
    ORDER BY
      CASE WHEN $2::uuid IS NOT NULL AND i.id = $2::uuid THEN 0 ELSE 1 END,
      i.created_at DESC
    LIMIT 1;
  `;

  const interviewRes = await pool.query(interviewQuery, [
    userId,
    validInterviewId,
  ]);
  const row = interviewRes.rows[0];

  if (!row) {
    return {
      interview: null,
      finalEvaluation: null,
      questionEvaluations: [],
      dsaEvaluations: [],
      availableInterviews: [],
    };
  }

  // Query 2: Fetch DSA problem evaluations for this interview
  const dsaQuery = `
    SELECT
      de.id,
      de.problem_id,
      p.title AS problem_title,
      de.score,
      de.correctness,
      de.time_complexity,
      de.space_complexity,
      de.strengths,
      de.weaknesses,
      de.feedback,
      de.created_at
    FROM dsa_evaluations de
    LEFT JOIN problems p ON p.id = de.problem_id
    WHERE de.interview_id = $1
    ORDER BY de.created_at ASC;
  `;

  const dsaRes = await pool.query(dsaQuery, [row.id]);

  return {
    interview: {
      id: row.id,
      role: row.role,
      difficulty: row.difficulty,
      status: row.status,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    },
    finalEvaluation:
      row.overall_score !== null && row.overall_score !== undefined
        ? {
            overallScore: Number(row.overall_score),
            hireChance: row.hire_chance,
            summary: row.summary,
            strengths: row.strengths ?? [],
            weaknesses: row.weaknesses ?? [],
            recommendations: row.recommendations ?? [],
          }
        : null,
    questionEvaluations: Array.isArray(row.question_evaluations)
      ? row.question_evaluations
      : [],
    dsaEvaluations: dsaRes.rows.map((d) => ({
      id: d.id,
      problemId: d.problem_id,
      problemTitle: d.problem_title,
      score: d.score,
      correctness: d.correctness,
      timeComplexity: d.time_complexity,
      spaceComplexity: d.space_complexity,
      strengths: d.strengths ?? [],
      weaknesses: d.weaknesses ?? [],
      feedback: d.feedback,
      createdAt: d.created_at,
    })),
    availableInterviews: Array.isArray(row.available_interviews)
      ? row.available_interviews
      : [],
  };
};

module.exports = { getReportDataModel };

