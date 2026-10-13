const axios = require("axios");

const BASE_URL = process.env.OPENROUTER_TTS_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = { api };
