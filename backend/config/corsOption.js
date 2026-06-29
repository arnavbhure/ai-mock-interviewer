const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_DEV,
  "http://localhost:5173",
]
  .map(trimTrailingSlash)
  .filter(Boolean);

const allowedOrigins = [...new Set(configuredOrigins)];

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  return allowedOrigins.includes(trimTrailingSlash(origin));
};

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

module.exports = { corsOptions, isOriginAllowed };
