const {
  generateInterviewRoundChain,
} = require("../../components/langchain/chains/generateInterviewRoundChain");
const {
  storeInterviewPlanModel,
} = require("../../models/interview/storeInterviewPlanModel");
const { getResumeModel } = require("../../models/resume/getResume.model");

const createInterviewController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { role, difficulty } = req.body;
    if (!role || !difficulty) {
      return res
        .status(400)
        .json({ message: "Role and difficulty are required", success: false });
    }

    const resumeData = await getResumeModel(user.id);

    //resume not containing other useless values
    const { created_at, updated_at, id, user_id, resume_url, ...resume } =
      resumeData;

    // creating interview plan based on the resume using llm
    const interviewPlan = await generateInterviewRoundChain.invoke({
      resume: resume,
    });

    // storing the interview plan in the db

    const store_result = await storeInterviewPlanModel(
      user?.id,
      interviewPlan,
      role,
      difficulty,
    );

    if (!store_result) {
      return res.status(500).json({
        message: "Failed to store interview plan",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Interview plan created successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in interviewController : ", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { createInterviewController };
