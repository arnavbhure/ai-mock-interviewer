require("dotenv").config();
const { Pool } = require("pg");

const baseConfig = {
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 10000, // fail fast if DB unavailable
  maxUses: 7500, // recycle clients to avoid stale connections
};

const pool = new Pool({
  ...baseConfig,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pool };
