const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { server, app } = require("./config/socket");
const { corsOptions } = require("./config/corsOption");
const { errorHandler } = require("./middlewares/error.middleware");
const { resumeRouter } = require("./routes/resumeRouter");
const { authRouter } = require("./routes/auth.router");

dotenv.config();

app.use(cors(corsOptions));

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

// For resume upload
app.use("/api/resume", resumeRouter);

// auth route
app.use("/api/auth", authRouter);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(errorHandler); // always last

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
