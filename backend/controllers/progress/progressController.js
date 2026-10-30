const {
  getProgressDataModel,
} = require("../../models/progress/getProgressData.model");

const progressController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const progressData = await getProgressDataModel(userId);

    return res.status(200).json({
      success: true,
      message: "Progress data fetched successfully",
      data: progressData,
    });
  } catch (error) {
    console.error("Error in progressController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch progress metrics",
    });
  }
};

module.exports = { progressController };

