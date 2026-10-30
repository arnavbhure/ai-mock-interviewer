import api from "../axios";

export interface HistoryInterviewItem {
  id: string;
  role: string;
  difficulty: "easy" | "medium" | "hard" | string;
  status: "completed" | "active" | "planning" | "paused" | "failed" | string;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  overallScore: number | null;
  hireChance: "Strong Hire" | "Hire" | "Weak Hire" | "No Hire" | string | null;
  summary: string | null;
}

export interface InterviewHistoryResponse {
  success: boolean;
  message?: string;
  data: {
    total: number;
    interviews: HistoryInterviewItem[];
  };
}

/**
 * Fetches the candidate's complete interview history.
 * Endpoint: GET /api/interview/history
 */
export async function getInterviewHistory(): Promise<HistoryInterviewItem[]> {
  const response = await api.get<InterviewHistoryResponse>("/interview/history");
  return response.data?.data?.interviews ?? [];
}

