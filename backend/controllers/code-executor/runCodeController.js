const {
  checkInterviewModel,
} = require("../../models/interview/checkInterviewModel");
const {
  getLatestInterviewByUserId,
} = require("../../models/interview/getLatestInterviewOfCandidiate");
const {
  codeExecutionService,
} = require("../../services/dsa/codeExecution.service");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const runCodeController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { code, language, problemId, test_cases } = req.body;
    let interviewId = req.body.interviewId;

    if (!interviewId || !UUID_REGEX.test(String(interviewId))) {
      const latest = await getLatestInterviewByUserId(user.id);
      if (latest) {
        interviewId = latest.id;
      }
    }

    if (!code || !language || !interviewId || !problemId || !test_cases) {
      return res.status(400).json({
        message:
          "Please provide code , Problem id , test cases and language to execute the code.",
        success: false,
      });
    }
    const is_valid_interview = await checkInterviewModel(interviewId, user.id);
    if (!is_valid_interview) {
      return res.status(400).json({
        message: "Invalid interview.",
        success: false,
      });
    }

    const code_execution_result = await codeExecutionService({
      code,
      language,
      test_cases,
    });

    return res.status(200).json({
      message: "Code executed successfully.",
      success: true,
      data: code_execution_result,
      interviewId,
    });
  } catch (err) {
    console.log("Error in runCodeController : ", err);
    return res
      .status(500)
      .json({ message: "Failed to run code.", success: false });
  }
};

module.exports = { runCodeController };
