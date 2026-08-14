const { MemorySaver } = require("@langchain/langgraph");
const { PostgresSaver } = require("@langchain/langgraph-checkpoint-postgres");
const { Pool } = require("pg");

let checkpointer = null;

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
      throw new Error("DATABASE_URL is required for Postgres checkpointer");
    }

    console.log("Using LangGraph PostgresSaver");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,

      // AWS RDS requires SSL in your current setup.
      // For LOCAL DEVELOPMENT only.
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Create LangGraph Postgres checkpointer
    checkpointer = new PostgresSaver(pool);

    // Creates LangGraph checkpoint tables/migrations
    await checkpointer.setup();

    console.log("LangGraph PostgresSaver initialized successfully");

    return checkpointer;
  }

  throw new Error(`Unknown LANGGRAPH_CHECKPOINTER: ${type}`);
};

const getCheckpointer = () => {
  if (!checkpointer) {
    throw new Error("Checkpointer has not been initialized");
  }

  return checkpointer;
};

module.exports = {
  initializeCheckpointer,
  getCheckpointer,
};
