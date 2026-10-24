const {
  checkInterviewModel,
} = require("../../models/interview/checkInterviewModel");

const runCodeController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { code, language, interviewId, problemId } = req.body;
    if (!code || !language || !interviewId || !problemId) {
      return res.status(400).json({
        message:
          "Please provide code , Problem id and language to execute the code.",
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
  } catch (err) {
    console.log("Error in runCodeController : ", err);
    return res
      .status(500)
      .json({ message: "Failed to run code.", success: false });
  }
};

module.exports = { runCodeController };
