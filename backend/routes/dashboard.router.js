const express = require("express");
const {
  dashboardController,
} = require("../controllers/dashboard/dashboardController");

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", dashboardController);

module.exports = { dashboardRouter };
