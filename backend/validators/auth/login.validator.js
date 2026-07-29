const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { loginValidator };
