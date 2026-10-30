const express = require("express");
const {
  progressController,
} = require("../controllers/progress/progressController");

const progressRouter = express.Router();

progressRouter.get("/progress", progressController);

module.exports = { progressRouter };

