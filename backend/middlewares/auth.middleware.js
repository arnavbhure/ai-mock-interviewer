const jwt = require("jsonwebtoken");
const { getUserById } = require("../models/user/getUserModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { password_hash, ...userWithoutPassword } = user;

    req.user = userWithoutPassword;
    next();
  } catch (err) {
    console.log("Error in authMiddleware : ", err.message || err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = { authMiddleware };
