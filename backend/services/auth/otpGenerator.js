const crypto = require("crypto");

const otpGenerator = () => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return { otp, otpExpiresAt };
};

module.exports = { otpGenerator };
