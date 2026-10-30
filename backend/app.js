const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  startCheckpointer,
} = require("./components/langgraph/config/startCheckpointer");
const { server, app, io } = require("./config/socket");
const { corsOptions } = require("./config/corsOption");
const { errorHandler } = require("./middlewares/error.middleware");
const { resumeRouter } = require("./routes/resumeRouter");
const { authRouter } = require("./routes/auth.router");
const { interviewRouter } = require("./routes/interview.router");
const { authMiddleware } = require("./middlewares/auth.middleware");
const { codeExecutorRouter } = require("./routes/code.executer.router");
const { dashboardRouter } = require("./routes/dashboard.router");
const { reportRouter } = require("./routes/report.router");

dotenv.config();

app.use(cors(corsOptions));

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

// For resume upload
app.use("/api/resume", authMiddleware, resumeRouter);

// auth route
app.use("/api/auth", authRouter);

//interview route
app.use("/api/interview", authMiddleware, interviewRouter);

// code executor route
app.use("/api/execute-code", authMiddleware, codeExecutorRouter);

// dashboard stats route
app.use("/api", authMiddleware, dashboardRouter);

// performance report route
app.use("/api", authMiddleware, reportRouter);

app.get("/ping", (req, res) => {
  res.send("ok");
});

app.use(errorHandler); // always last

const startServer = async () => {
  try {
    await startCheckpointer();
    const { registerSocketHandlers } = require("./socket");
    registerSocketHandlers(io);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    process.exit(1);
  }
};

startServer();
