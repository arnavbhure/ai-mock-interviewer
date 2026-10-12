const {
  getLatestInterviewByUserId,
} = require("../models/interview/getLatestInterviewOfCandidiate");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookies = cookie.parseCookie(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    if (!token) {
      return next(new Error("Authentication token is required."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const interviewData = await getLatestInterviewByUserId(decoded.userId);

    if (!interviewData) {
      return next(new Error("No interview found for this user."));
    }

    socket.user = {
      user_id: interviewData.user_id,
    };

    socket.interview = {
      interview_id: interviewData.id,
      resume_id: interviewData.resume_id,
      status: interviewData.status,
      created_at: interviewData.created_at,
    };

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);

    next(new Error("Invalid authentication token."));
  }
};

module.exports = { socketAuthMiddleware };
