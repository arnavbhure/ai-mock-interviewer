const { pool } = require("../../config/db");

/**
 * Fetches hidden (and public fallback) test cases for a problem from problem_test_cases.
 */
const getHiddenTestCases = async (problemId, limit = 10) => {
  const query = `
    SELECT
      id,
      input_data,
      expected_output,
      stdin_input,
      expected_stdout,
      visibility
    FROM problem_test_cases
    WHERE problem_id = $1
    ORDER BY
      CASE WHEN visibility = 'hidden' THEN 0 ELSE 1 END,
      test_number ASC
    LIMIT $2;
  `;
  const { rows } = await pool.query(query, [problemId, limit]);
  return rows;
};

module.exports = { getHiddenTestCases };

