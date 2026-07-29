const jwt = require("jsonwebtoken");

const createAuthToken = (user, purpose) => {
  const payload = {
    userId: user.id,
    email: user.email,
    purpose,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn:
      purpose === "password_reset"
        ? process.env.JWT_PASS_RESET_EXPIRES_IN
        : process.env.JWT_EXPIRES_IN,
  });
  const decodedToken = jwt.decode(token);
  const expiresAt =
    purpose === "password_reset"
      ? 10 * 60 * 1000
      : decodedToken?.exp
        ? decodedToken.exp * 1000
        : Date.now() + 2 * 24 * 60 * 60 * 1000;

  return { token, expiresAt };
};

module.exports = { createAuthToken };
