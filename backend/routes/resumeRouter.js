const express = require("express");
const { uploadResume } = require("../middlewares/resumeUpload.middleware");
const {
  resumeUploadController,
} = require("../controllers/resume/resumeUploadController");
const { authMiddleware } = require("../middlewares/auth.middleware");

const resumeRouter = express.Router();

resumeRouter.post(
  "/upload",
  authMiddleware,
  uploadResume,
  resumeUploadController,
);

module.exports = { resumeRouter };
