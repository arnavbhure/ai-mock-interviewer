import socket from "../socket";

export const startInterview = () => {
  socket.emit("interview:start");
};
