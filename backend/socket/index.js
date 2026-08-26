const {
  socketAuthMiddleware,
} = require("../middlewares/socketAuth.middleware");

const registerSocketHandlers = (io) => {
  // Authenticate every socket connection
  io.use(socketAuthMiddleware);
};

module.exports = { registerSocketHandlers };
