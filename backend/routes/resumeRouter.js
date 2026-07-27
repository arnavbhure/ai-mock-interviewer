const express = require("express");
const { uploadResume } = require("../middlewares/resumeUpload.middleware");
const {
  resumeUploadController,
} = require("../controllers/resume/resumeUploadController");

const resumeRouter = express.Router();

resumeRouter.post("/upload", uploadResume, resumeUploadController);

module.exports = { resumeRouter };
