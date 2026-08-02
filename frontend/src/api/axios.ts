import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
import { toast } from "sonner";

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
      toast.error(error.response?.data?.message || "Something went wrong.");
    }

    return Promise.reject(error);
  },
);

export default api;
