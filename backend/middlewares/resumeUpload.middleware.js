const multer = require("multer");

const MAX_FILE_SIZE = 6 * 1024 * 1024;
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.mimetype !== "application/pdf") {
    return callback(new Error("Only PDF files are allowed"), false);
  }

  callback(null, true);
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter,
}).single("resume");

module.exports = { uploadResume };
