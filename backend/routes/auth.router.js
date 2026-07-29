const express = require("express");
const {
  validateRequest,
} = require("../middlewares/validateRequest.middleware");
const { signupValidator } = require("../validators/auth/signupValidator");
const { signupController } = require("../controllers/auth/signup.controllers");

const authRouter = express.Router();

authRouter.post("/signup", signupValidator, validateRequest, signupController);

module.exports = { authRouter };
