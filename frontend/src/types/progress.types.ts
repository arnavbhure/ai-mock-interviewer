export interface SkillMetric {
  name: string;
  score: number; // 0-100
  change: number; // percentage point delta
  benchmark: number; // target benchmark score
}

export interface ProgressionHistoryPoint {
  label: string;
  score: number;
  role: string;
  date: string;
  hireChance: string | null;
}

export interface ProgressData {
  totalSessions: number;
  averageScore: number;
  scoreChange: number;
  skills: SkillMetric[];
  progressionHistory: ProgressionHistoryPoint[];
  topStrengths: string[];
  focusAreas: string[];
  recommendedPractice: string[];
}

export interface ProgressApiResponse {
  success: boolean;
  message?: string;
  data: ProgressData;
}

