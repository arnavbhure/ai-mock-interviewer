const { getUserByEmail } = require("../../models/user/getUserbyEmail");
const { comparePassword } = require("../../services/auth/password.service");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Account with this email does not exist. Please sign up first.",
      });
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password_hash,
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const {
      password_hash,
      otp,
      otpExpiresAt,
      updated_at,
      ...userWithoutPassword
    } = existingUser;

    const { token, expiresAt } = createAuthToken(safeUser, "login");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.log("Error in LoginController", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = { loginController };
