const {
  getInterviewHistoryModel,
} = require("../../models/interview/getInterviewHistory.model");

const getInterviewHistoryController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const interviews = await getInterviewHistoryModel(userId);

    return res.status(200).json({
      success: true,
      message: "Interview history fetched successfully",
      data: {
        total: interviews.length,
        interviews,
      },
    });
  } catch (error) {
    console.error("Error in getInterviewHistoryController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch interview history",
    });
  }
};

module.exports = { getInterviewHistoryController };

