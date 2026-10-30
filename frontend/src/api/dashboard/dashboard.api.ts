import api from "../axios";
import type { DashboardApiResponse, ParsedDashboardData } from "@/types/dashboard.types";

/**
 * Fetches dashboard performance metrics and recent interview evaluations.
 * Endpoint: GET /api/dashboard
 */
export async function getDashboardData(): Promise<ParsedDashboardData> {
  const response = await api.get<DashboardApiResponse>("/dashboard");

  const raw = response.data?.data;
  const rawStats = raw?.dashboardStats ?? {};
  const rawList = Array.isArray(raw?.interviewStats) ? raw.interviewStats : [];

  const rawAvg = rawStats.averageScore ?? rawStats.average_score;
  const parsedAvg = rawAvg !== undefined && rawAvg !== null ? Number(rawAvg) : 0;

  const dashboardStats = {
    totalInterviews: Number(rawStats.totalInterviews ?? rawStats.total_interviews ?? 0),
    completedInterviews: Number(rawStats.completedInterviews ?? rawStats.completed_interviews ?? 0),
    activeInterviews: Number(rawStats.activeInterviews ?? rawStats.active_interviews ?? 0),
    averageScore: isNaN(parsedAvg) ? 0 : parsedAvg,
    strongHireCount: Number(rawStats.strongHireCount ?? rawStats.strong_hire_count ?? 0),
  };

  const interviewStats = rawList.map((item) => {
    const rawScore = item.overallScore ?? item.overall_score;
    const parsedScore =
      rawScore !== undefined && rawScore !== null && !isNaN(Number(rawScore))
        ? Number(rawScore)
        : null;

    return {
      id: String(item.id || ""),
      role: String(item.role || "Candidate"),
      status: String(item.status || "completed"),
      difficulty: String(item.difficulty || "medium"),
      overallScore: parsedScore,
      hireChance: item.hireChance ?? item.hire_chance ?? null,
      createdAt: String(item.createdAt || item.created_at || ""),
    };
  });

  return {
    dashboardStats,
    interviewStats,
  };
}

