const {
  dashboardStatsResultModel,
} = require("../../models/dashboard/dashboardstatsResult.model");
const {
  getInterviewStats,
} = require("../../models/dashboard/getInterviewStats.model");

const dashboardController = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Unauthorized" });
    }

    const [interviewStats, dashboardStats] = await Promise.all([
      getInterviewStats(userId),
      dashboardStatsResultModel(userId),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        interviewStats,
        dashboardStats,
      },
    });
  } catch (err) {
    console.log("Error in dashboardController : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { dashboardController };
