import axios from "axios";
import { isLoggedInActions } from "../store/user/isLoggedin";
import { userActions } from "../store/user/userSlice";
import store from "../store/index";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
