const express = require("express");
const {
  createInterviewController,
} = require("../controllers/interview/create.interview.controller");
const {
  getInterviewHistoryController,
} = require("../controllers/interview/getInterviewHistory.controller");

const interviewRouter = express.Router();

interviewRouter.post("/create-interview", createInterviewController);
interviewRouter.get("/history", getInterviewHistoryController);
interviewRouter.get("/", getInterviewHistoryController);

module.exports = { interviewRouter };
