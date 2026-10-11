import api from "../axios";

export interface CreateInterviewPayload {
  role: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface CreateInterviewResponse {
  success: boolean;
  message: string;
  data?: {
    interview_id?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Creates a new interview session by sending the candidate's selected role
 * and difficulty to the backend. The backend uses the already-uploaded resume
 * to generate a personalized interview plan via LLM.
 *
 * @param payload - { role, difficulty }
 * @returns Promise resolving to CreateInterviewResponse
 */
export async function createInterview(
  payload: CreateInterviewPayload,
): Promise<CreateInterviewResponse> {
  const response = await api.post<CreateInterviewResponse>(
    "/interview/create-interview",
    payload,
    { skipErrorToast: true },
  );

  return response.data;
}

export default createInterview;
