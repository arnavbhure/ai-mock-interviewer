const { pool } = require("../../config/db");

const getEvaluationResultsFromDB = async (interviewId) => {
  const query = `SELECT evaluations FROM interview_evaluations WHERE interview_id = $1;`;
  const dsaQuery = `
    SELECT id, interview_id, problem_id, score, correctness, time_complexity, space_complexity, strengths, weaknesses, feedback 
    FROM dsa_evaluations 
    WHERE interview_id = $1;
  `;

  const values = [interviewId];

  const [normalRes, dsaRes] = await Promise.all([
    pool.query(query, values).catch((err) => {
      console.warn("Could not query interview_evaluations:", err.message);
      return { rows: [] };
    }),
    pool.query(dsaQuery, values).catch((err) => {
      console.warn("Could not query dsa_evaluations:", err.message);
      return { rows: [] };
    }),
  ]);

  const normalEvaluations = normalRes.rows?.[0]?.evaluations || [];
  const dsaEvaluations = (dsaRes.rows || []).map((row) => ({
    roundType: "dsa",
    problemId: row.problem_id,
    score: row.score,
    correctness: row.correctness,
    timeComplexity: row.time_complexity,
    spaceComplexity: row.space_complexity,
    strengths:
      typeof row.strengths === "string"
        ? JSON.parse(row.strengths || "[]")
        : row.strengths,
    weaknesses:
      typeof row.weaknesses === "string"
        ? JSON.parse(row.weaknesses || "[]")
        : row.weaknesses,
    feedback: row.feedback,
  }));

  const combined = [...normalEvaluations, ...dsaEvaluations];

  return [{ evaluations: combined }];
};

module.exports = { getEvaluationResultsFromDB };
