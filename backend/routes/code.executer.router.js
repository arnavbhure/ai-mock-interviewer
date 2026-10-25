const express = require("express");
const {
  runCodeController,
} = require("../controllers/code-executor/runCodeController");
const {
  submitCodeController,
} = require("../controllers/code-executor/submitCodeController");
const codeExecutorRouter = express.Router();

// to run code without hidden test cases
codeExecutorRouter.post("/run-code", runCodeController);

// to run code with hidden test cases
codeExecutorRouter.post("/submit-code", submitCodeController);

module.exports = { codeExecutorRouter };
