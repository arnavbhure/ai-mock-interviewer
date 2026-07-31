const { getUserByEmail } = require("../../models/user/getUserModel");
const { otpGenerator } = require("../../services/auth/otpGenerator");
const { sendEmail } = require("../../services/email/email.service");
const {
  verificationEmailTemplate,
} = require("../../utils/templates/verificationEmailTemplate");
const { createUserModel } = require("../../models/user/createUserModel");
const { hashPassword } = require("../../services/auth/password.service");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists. Please login instead.",
      });
    }

    const { otp, otpExpiresAt } = otpGenerator();

    const userDetails = {
      name,
      email,
      password_hash: await hashPassword(password),
      otp,
      otpExpiresAt,
    };

    try {
      await sendEmail({
        to: email,
        subject: "Verify Your Ai Mock Interviewer Account",
        htmlContent: verificationEmailTemplate(otp),
      });

      const newUser = await createUserModel(userDetails);

      return res.status(201).json({
        message: "Verification OTP has been sent to your email.",
        success: true,
      });
    } catch (err) {
      console.error("Error sending verification email:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email",
        error: err.message,
      });
    }
  } catch (err) {
    console.log("Error in signupController:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = { signupController };
