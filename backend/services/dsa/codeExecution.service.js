const axios = require("axios");

const BASE_URL = process.env.ONLINE_COMPILER_BASE_URL;
const apiKey = process.env.ONLINE_COMPILER_API_KEY;

const COMPILER_BY_LANGUAGE = {
  cpp: "g++-15",
  python: "python-3.14",
  javascript: "nodejs-24",
  java: "openjdk-25",
};

const codeExecutionService = async ({ code, language, test_cases }) => {
  if (!BASE_URL || !apiKey) {
    throw new Error(
      "Online compiler base URL or API key is not defined in environment variables.",
    );
  }

  const compiler = COMPILER_BY_LANGUAGE[language];
  if (!compiler) {
    const error = new Error(`Unsupported programming language : ${language}`);
    error.statusCode = 400;
    throw error;
  }

  if (!Array.isArray(test_cases) || test_cases.length === 0) {
    const error = new Error("No test cases are available.");
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/run-tests`,
      {
        compiler,
        code,
        tests: test_cases.map((test) => ({
          input: test.input ?? "",
          expected_output: test.expectedOutput,
          hidden: Boolean(test.hidden),
        })),
        time_limit: 2,
        checker: "tokens",
        scoring: "all_or_nothing",
        stop_on_failure: true,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        timeout: 65000,
      },
    );

    return response.data;
  } catch (err) {
    console.error("Error in codeExecutionService : ", err);
    return {
      success: false,
      message: "Failed to execute code.",
      error: err.message || "Unknown error",
    };
  }
};

module.exports = { codeExecutionService };
