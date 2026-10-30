export type Difficulty = "easy" | "medium" | "hard";

export type DashboardFormValues = {
  role: string;
  resume: File | null;
  difficulty: Difficulty | null;
};

export type InterviewRequest = {
  role: string;
  resume: File;
  difficulty: Difficulty;
};

export type InterviewResponse = {
  success: boolean;
  message: string;
  interview_id?: string;
  redirect_url?: string;
};

export const COMMON_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Engineering Manager",
  "Product Manager",
] as const;

export const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  description: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Foundational questions",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Real interview level",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Challenging questions",
  },
];

export const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
export const ACCEPTED_FILE_TYPES = ["application/pdf"];

/* =========================================================
   DASHBOARD ANALYTICS & API
   ========================================================= */

export type InterviewStatus = "completed" | "in_progress" | "active" | "scheduled";

export type SkillName =
  | "Technical Knowledge"
  | "Problem Solving"
  | "Communication"
  | "Confidence";

export interface DashboardStat {
  label: string;
  value: string;
  context: string;
}

export interface DashboardSkill {
  name: SkillName;
  /** 0–100 */
  score: number;
  /** Percentage-point change versus the previous period. */
  change: number;
}

export interface RecentInterview {
  id: string;
  role: string;
  type?: string;
  difficulty?: string;
  date: string;
  score: number | null;
  hireChance?: string | null;
  status: InterviewStatus | string;
}

export interface TrendPoint {
  label: string;
  score: number;
}

/* ─── Real Backend /api/dashboard Response Types ─── */

export interface RawDashboardStats {
  totalInterviews?: number;
  total_interviews?: number;
  completedInterviews?: number;
  completed_interviews?: number;
  activeInterviews?: number;
  active_interviews?: number;
  averageScore?: number | string;
  average_score?: number | string;
  strongHireCount?: number;
  strong_hire_count?: number;
}

export interface RawInterviewStat {
  id: string;
  role: string;
  status: string;
  difficulty: "easy" | "medium" | "hard" | string;
  overallScore?: number | string | null;
  overall_score?: number | string | null;
  hireChance?: string | null;
  hire_chance?: string | null;
  createdAt?: string;
  created_at?: string;
}

export interface DashboardApiResponse {
  success: boolean;
  message?: string;
  data: {
    dashboardStats: RawDashboardStats;
    interviewStats: RawInterviewStat[];
  };
}

export interface ParsedDashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  activeInterviews: number;
  averageScore: number;
  strongHireCount: number;
}

export interface ParsedInterviewStat {
  id: string;
  role: string;
  status: string;
  difficulty: string;
  overallScore: number | null;
  hireChance: string | null;
  createdAt: string;
}

export interface ParsedDashboardData {
  dashboardStats: ParsedDashboardStats;
  interviewStats: ParsedInterviewStat[];
}
