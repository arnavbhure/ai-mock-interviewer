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

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ["application/pdf"];

/* =========================================================
   DASHBOARD ANALYTICS
   ========================================================= */

export type InterviewStatus = "completed" | "in_progress" | "scheduled";

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
  /** e.g. "Technical + Behavioral" */
  type: string;
  /** Human-readable relative date, e.g. "2 days ago". */
  date: string;
  /** 0–100 for completed interviews, null while still in progress. */
  score: number | null;
  status: InterviewStatus;
}

export interface TrendPoint {
  label: string;
  score: number;
}