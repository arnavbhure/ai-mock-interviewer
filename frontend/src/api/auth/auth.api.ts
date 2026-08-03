import api from "../axios";

export const login = async (payload: { email: string; password: string }) => {
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
