import axios from "axios";
import { toastError } from "@/components/ui/toast";
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipToast = error.config?.skipErrorToast;

    if (!skipToast) {
      toastError(error.response?.data?.message || "Something went wrong.");
    }

    return Promise.reject(error);
  },
);

export default api;
