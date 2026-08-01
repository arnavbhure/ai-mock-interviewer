const {
  generateInterviewRoundChain,
} = require("../../components/langchain/chains/generateInterviewRoundChain");
const { getResumeModel } = require("../../models/resume/getResume.model");

const createInterviewController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
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
  } catch (err) {
    console.log("Error in interviewController : ", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { createInterviewController };
