const resumeUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume pdf is required" });
    }
  } catch (err) {
    console.log("Error in resumeUploadController:", err);
    return { success: false, message: "Error in resumeUploadController" };
  }
};

module.exports = { resumeUploadController };
