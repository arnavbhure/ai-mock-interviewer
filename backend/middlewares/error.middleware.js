const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Resume size must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  if (err.message === "Only PDF resumes are allowed.") {
    return res.status(400).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
