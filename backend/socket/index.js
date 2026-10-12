const {
  socketAuthMiddleware,
} = require("../middlewares/socketAuth.middleware");
const { registerInterviewSocket } = require("./startInterview.socket");

const registerSocketHandlers = (io) => {
  // Authenticate every socket connection
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerInterviewSocket(socket);
  });
};

module.exports = { registerSocketHandlers };
