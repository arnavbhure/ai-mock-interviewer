const { pool } = require("../../config/db");

let tableInitialized = false;

const ensureTableExists = async () => {
  if (tableInitialized) return;
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS dsa_submissions (
      id SERIAL PRIMARY KEY,
      interview_id VARCHAR(255) NOT NULL,
      problem_id VARCHAR(255) NOT NULL,
      code TEXT NOT NULL,
      language VARCHAR(50) NOT NULL,
      verdict VARCHAR(50),
      passed_tests INT DEFAULT 0,
      total_tests INT DEFAULT 0,
      execution_time VARCHAR(50),
      memory VARCHAR(50),
      is_skip BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    tableInitialized = true;
  } catch (err) {
    console.log("Could not ensure dsa_submissions table exists:", err.message);
  }
};

const saveDsaSubmissionModel = async ({
  interviewId,
  problemId,
  code = "",
  language = "javascript",
  verdict = "pending",
  passedTests = 0,
  totalTests = 0,
  executionTime = null,
  memory = null,
  isSkip = false,
}) => {
  await ensureTableExists();

  const query = `
    INSERT INTO dsa_submissions (
      interview_id,
      problem_id,
      code,
      language,
      verdict,
      passed_tests,
      total_tests,
      execution_time,
      memory,
      is_skip
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    String(interviewId),
    String(problemId),
    code,
    language,
    verdict,
    passedTests,
    totalTests,
    executionTime ? String(executionTime) : null,
    memory ? String(memory) : null,
    Boolean(isSkip),
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    console.warn("Error inserting into dsa_submissions:", err.message);
    return null;
  }
};

module.exports = { saveDsaSubmissionModel };
