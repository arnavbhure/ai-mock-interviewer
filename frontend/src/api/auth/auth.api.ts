import socket from "@/socket/socket";
import api from "../axios";

export const login = async (payload: { email: string; password: string }) => {
  socket.connect();
  const response = await api.post("/auth/login", payload);
  return response.data;
};

interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const register = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/signup", payload);
  return response.data;
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-otp", payload);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/get-user");
  return response.data;
};

// Interview API
export interface CreateInterviewPayload {
  role: string;
  difficulty: "easy" | "medium" | "hard";
  resume: File;
}

export interface CreateInterviewResponse {
  success: boolean;
  message: string;
  interview_id?: string;
  redirect_url?: string;
}

export const createInterview = async (
  payload: CreateInterviewPayload,
): Promise<CreateInterviewResponse> => {
  const formData = new FormData();
  formData.append("role", payload.role);
  formData.append("difficulty", payload.difficulty);
  formData.append("resume", payload.resume);

  const response = await api.post("/interviews/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    skipErrorToast: true,
  });
  return response.data;
};
