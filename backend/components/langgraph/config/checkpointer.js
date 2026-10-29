const { MemorySaver } = require("@langchain/langgraph");
const { PostgresSaver } = require("@langchain/langgraph-checkpoint-postgres");
const { Pool } = require("pg");

// Default to in-memory checkpointer immediately so graph compilation never throws
let checkpointer = new MemorySaver();

const initializeCheckpointer = async () => {
  const type = process.env.LANGGRAPH_CHECKPOINTER || "memory";

  // ------------------------------------
  // MEMORY CHECKPOINTER
  // ------------------------------------
  if (type === "memory") {
    console.log("Using LangGraph MemorySaver");
    checkpointer = new MemorySaver();
    return checkpointer;
  }

  // ------------------------------------
  // POSTGRES CHECKPOINTER
  // ------------------------------------
  if (type === "postgres") {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is missing, falling back to MemorySaver");
      checkpointer = new MemorySaver();
      return checkpointer;
    }

    try {
      console.log("Initializing LangGraph PostgresSaver...");
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        connectionTimeoutMillis: 5000,
      });

      const pgSaver = new PostgresSaver(pool);
      await pgSaver.setup();
      checkpointer = pgSaver;
      console.log("LangGraph PostgresSaver initialized successfully");
      return checkpointer;
    } catch (err) {
      console.warn("Failed to connect to Postgres checkpointer, falling back to MemorySaver:", err.message);
      checkpointer = new MemorySaver();
      return checkpointer;
    }
  }

  return checkpointer;
};

const getCheckpointer = () => {
  return checkpointer;
};

/**
 * Proxy delegator that allows StateGraph to compile synchronously with a checkpointer
 * while seamlessly forwarding all calls to whichever checkpointer (Postgres or Memory)
 * is currently active.
 */
const checkpointerProxy = new Proxy(
  {},
  {
    get: (_target, prop) => {
      const active = getCheckpointer();
      const val = active[prop];
      return typeof val === "function" ? val.bind(active) : val;
    },
  }
);

module.exports = { initializeCheckpointer, getCheckpointer, checkpointerProxy };
