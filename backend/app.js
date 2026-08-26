const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { server, app, io } = require("./config/socket");
const { corsOptions } = require("./config/corsOption");
const { errorHandler } = require("./middlewares/error.middleware");
const { resumeRouter } = require("./routes/resumeRouter");
const { authRouter } = require("./routes/auth.router");
const { interviewRouter } = require("./routes/interview.router");
const { authMiddleware } = require("./middlewares/auth.middleware");
const {
  startCheckpointer,
} = require("./components/langgraph/config/startCheckpointer");
const { socketAuthMiddleware } = require("./middlewares/socketAuth.middleware");
const { registerSocketHandlers } = require("./socket");

dotenv.config();

app.use(cors(corsOptions));

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

startCheckpointer();

app.set("trust proxy", 1);

registerSocketHandlers(io);

// For resume upload
app.use("/api/resume", authMiddleware, resumeRouter);

// auth route
app.use("/api/auth", authRouter);

//interview route
app.use("/api/interview", authMiddleware, interviewRouter);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(errorHandler); // always last

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
