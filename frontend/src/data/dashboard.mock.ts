import type {
  DashboardSkill,
  DashboardStat,
  RecentInterview,
  TrendPoint,
} from "@/types/dashboard.types";

/**
 * Set to `false` to preview the new-user / empty dashboard state.
 * Replace these placeholder arrays with server data once the
 * reporting API is available.
 */
export const HAS_INTERVIEWS = true;

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: "Overall Score", value: "82%", context: "+6 pts vs last month" },
  { label: "Interviews Completed", value: "12", context: "3 in the last 30 days" },
  { label: "Improvement", value: "+14%", context: "compared to 30 days ago" },
];

export const EMPTY_DASHBOARD_STATS: DashboardStat[] = [
  { label: "Overall Score", value: "--", context: "No data yet" },
  { label: "Interviews Completed", value: "0", context: "Complete your first interview" },
  { label: "Improvement", value: "--", context: "No data yet" },
];

export const SKILL_SCORES: DashboardSkill[] = [
  { name: "Technical Knowledge", score: 82, change: 4 },
  { name: "Problem Solving", score: 88, change: 6 },
  { name: "Communication", score: 76, change: 2 },
  { name: "Confidence", score: 74, change: 3 },
];

export const RECENT_INTERVIEWS: RecentInterview[] = [
  {
    id: "iv_0921",
    role: "Full Stack Developer",
    type: "Technical + Behavioral",
    date: "Aug 18",
    score: 82,
    status: "completed",
  },
  {
    id: "iv_0914",
    role: "Frontend Developer",
    type: "Technical",
    date: "Aug 15",
    score: 76,
    status: "completed",
  },
  {
    id: "iv_0903",
    role: "Backend Developer",
    type: "System Design",
    date: "Aug 10",
    score: 79,
    status: "completed",
  },
  {
    id: "iv_0891",
    role: "Machine Learning Engineer",
    type: "Technical",
    date: "Aug 5",
    score: null,
    status: "in_progress",
  },
];

export const PERFORMANCE_TREND: TrendPoint[] = [
  { label: "Int 1", score: 68 },
  { label: "Int 2", score: 73 },
  { label: "Int 3", score: 79 },
  { label: "Int 4", score: 82 },
  { label: "Int 5", score: 80 },
  { label: "Int 6", score: 84 },
  { label: "Int 7", score: 81 },
  { label: "Int 8", score: 85 },
];

export const TREND_AVERAGE = Math.round(
  PERFORMANCE_TREND.reduce((sum, point) => sum + point.score, 0) /
    PERFORMANCE_TREND.length,
);