const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { corsOptions, isOriginAllowed } = require("./corsOption");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
  allowRequest: (req, callback) => {
    callback(null, isOriginAllowed(req.headers.origin));
  },
});

module.exports = { io, app, server };
