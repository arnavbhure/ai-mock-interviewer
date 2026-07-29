const express = require("express");
const {
  validateRequest,
} = require("../middlewares/validateRequest.middleware");
const { signupValidator } = require("../validators/auth/signupValidator");
const { signupController } = require("../controllers/auth/signup.controllers");
const { loginValidator } = require("../validators/auth/login.validator");
const { loginController } = require("../controllers/auth/login.controllers");
const { logoutController } = require("../controllers/auth/logout.controllers");

const authRouter = express.Router();

authRouter.post("/signup", signupValidator, validateRequest, signupController);

authRouter.post("/login", loginValidator, validateRequest, loginController);

authRouter.post("/logout", logoutController);

module.exports = { authRouter };
