const express = require("express");
const {
  reportController,
} = require("../controllers/report/reportController");

const reportRouter = express.Router();

reportRouter.get("/reports", reportController);
reportRouter.get("/reports/:interviewId", reportController);

module.exports = { reportRouter };

