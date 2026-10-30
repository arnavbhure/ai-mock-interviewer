const { pool } = require("../../config/db");

/**
 * Calculates skill progression metrics for a candidate across all completed interviews.
 */
const getProgressDataModel = async (userId) => {
  // Query 1: Fetch all completed interviews with final evaluation data
  const interviewsQuery = `
    SELECT
      i.id,
      i.role,
      i.difficulty,
      i.created_at,
      fe.overall_score,
      fe.hire_chance,
      fe.strengths,
      fe.weaknesses,
      fe.recommendations
    FROM interviews i
    JOIN final_evaluations fe ON fe.interview_id = i.id
    WHERE i.user_id = $1
    ORDER BY i.created_at ASC;
  `;

  // Query 2: Fetch all DSA evaluations for this candidate
  const dsaQuery = `
    SELECT
      de.score,
      de.correctness,
      de.time_complexity,
      de.space_complexity,
      de.strengths,
      de.weaknesses,
      de.created_at
    FROM dsa_evaluations de
    JOIN interviews i ON i.id = de.interview_id
    WHERE i.user_id = $1
    ORDER BY de.created_at ASC;
  `;

  const [interviewRes, dsaRes] = await Promise.all([
    pool.query(interviewsQuery, [userId]),
    pool.query(dsaQuery, [userId]),
  ]);

  const interviews = interviewRes.rows;
  const dsaEvals = dsaRes.rows;

  const totalSessions = interviews.length;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      skills: [
        { name: "Technical Knowledge", score: 0, change: 0, benchmark: 75 },
        { name: "Problem Solving", score: 0, change: 0, benchmark: 80 },
        { name: "Communication", score: 0, change: 0, benchmark: 70 },
        { name: "Code Optimization", score: 0, change: 0, benchmark: 75 },
        { name: "System Design", score: 0, change: 0, benchmark: 70 },
      ],
      progressionHistory: [],
      topStrengths: [],
      focusAreas: [],
      recommendedPractice: [],
    };
  }

  // Calculate overall average score
  const scores = interviews.map((iv) => Number(iv.overall_score) * 10);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalSessions);

  // Calculate change between first half and second half (or last vs previous)
  let scoreChange = 0;
  if (totalSessions >= 2) {
    const half = Math.floor(totalSessions / 2);
    const firstHalfAvg =
      scores.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const secondHalfAvg =
      scores.slice(half).reduce((a, b) => a + b, 0) / (totalSessions - half);
    scoreChange = Math.round(secondHalfAvg - firstHalfAvg);
  }

  // DSA specific metrics
  let dsaAvg = avgScore;
  if (dsaEvals.length > 0) {
    const dsaScores = dsaEvals.map((d) => Number(d.score) * 10);
    dsaAvg = Math.round(dsaScores.reduce((a, b) => a + b, 0) / dsaScores.length);
  }

  // Compute skill proficiencies
  const skills = [
    {
      name: "Technical Knowledge",
      score: Math.min(100, Math.max(0, avgScore + 2)),
      change: scoreChange,
      benchmark: 75,
    },
    {
      name: "Problem Solving",
      score: Math.min(100, Math.max(0, dsaAvg)),
      change: Math.round(scoreChange * 1.1),
      benchmark: 80,
    },
    {
      name: "Communication",
      score: Math.min(100, Math.max(0, avgScore - 4)),
      change: Math.max(0, Math.round(scoreChange * 0.8)),
      benchmark: 70,
    },
    {
      name: "Code Optimization",
      score: Math.min(100, Math.max(0, dsaAvg - 2)),
      change: scoreChange,
      benchmark: 75,
    },
    {
      name: "System Design",
      score: Math.min(100, Math.max(0, avgScore - 6)),
      change: Math.max(0, Math.round(scoreChange * 0.6)),
      benchmark: 70,
    },
  ];

  // Map chronological progression
  const progressionHistory = interviews.map((iv, idx) => ({
    label: `Int ${idx + 1}`,
    score: Math.round(Number(iv.overall_score) * 10),
    role: iv.role,
    date: iv.created_at,
    hireChance: iv.hire_chance,
  }));

  // Aggregate and deduplicate strengths & focus areas
  const allStrengths = [];
  const allWeaknesses = [];
  const allRecommendations = [];

  for (const iv of interviews) {
    if (Array.isArray(iv.strengths)) allStrengths.push(...iv.strengths);
    if (Array.isArray(iv.weaknesses)) allWeaknesses.push(...iv.weaknesses);
    if (Array.isArray(iv.recommendations)) allRecommendations.push(...iv.recommendations);
  }

  for (const d of dsaEvals) {
    if (Array.isArray(d.strengths)) allStrengths.push(...d.strengths);
    if (Array.isArray(d.weaknesses)) allWeaknesses.push(...d.weaknesses);
  }

  const topStrengths = [...new Set(allStrengths.filter(Boolean))].slice(0, 5);
  const focusAreas = [...new Set(allWeaknesses.filter(Boolean))].slice(0, 5);
  const recommendedPractice = [...new Set(allRecommendations.filter(Boolean))].slice(0, 4);

  return {
    totalSessions,
    averageScore: avgScore,
    scoreChange,
    skills,
    progressionHistory,
    topStrengths,
    focusAreas,
    recommendedPractice,
  };
};

module.exports = { getProgressDataModel };

