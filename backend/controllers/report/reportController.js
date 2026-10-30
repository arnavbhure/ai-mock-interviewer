const {
  getReportDataModel,
} = require("../../models/report/getReportData.model");

const reportController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const interviewId = req.query.interviewId || req.params.interviewId || null;

    const reportData = await getReportDataModel(userId, interviewId);

    return res.status(200).json({
      success: true,
      message: "Report data retrieved successfully",
      data: reportData,
    });
  } catch (error) {
    console.error("Error in reportController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error fetching report",
    });
  }
};

module.exports = { reportController };

