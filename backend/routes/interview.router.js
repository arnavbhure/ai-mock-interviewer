const express = require("express");
const {
  createInterviewController,
} = require("../controllers/interview/create.interview.controller");

const interviewRouter = express.Router();

interviewRouter.post("/create-interview", createInterviewController);

module.exports = { interviewRouter };
