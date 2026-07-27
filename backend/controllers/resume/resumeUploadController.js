const { processResume } = require("../../services/resume/resumeService");

const resumeUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume pdf is required" });
    }
    const cleanResume = await processResume(req.file.buffer);

    return res.status(200).json({
      success: true,
      cleanResume,
      message: "Resume processed successfully",
    });
  } catch (err) {
    console.log("Error in resumeUploadController:", err);
    return { success: false, message: "Error in resumeUploadController" };
  }
};

module.exports = { resumeUploadController };
