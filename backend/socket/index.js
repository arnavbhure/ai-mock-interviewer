const {
  socketAuthMiddleware,
} = require("../middlewares/socketAuth.middleware");
const { registerInterviewSocket } = require("./startInterview.socket");

const registerSocketHandlers = (io) => {
  // Authenticate every socket connection
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    if (socket.interview?.interview_id) {
      socket.join(String(socket.interview.interview_id));
    }
    registerInterviewSocket(socket);
  });
};

module.exports = { registerSocketHandlers };
