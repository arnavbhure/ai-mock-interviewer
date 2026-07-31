const { getUserOtp, markAsVerified } = require("../../models/user/getUserOtp");

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingUser = await getUserOtp(email);

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (existingUser.otp !== otp || existingUser.otp_expires_at < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid OTP or Otp expired", success: false });
    }

    const verified = await markAsVerified(existingUser.id);
    if (!verified) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }

    return res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (err) {
    console.log("Error in verifyOtpController : ", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { verifyOtpController };
