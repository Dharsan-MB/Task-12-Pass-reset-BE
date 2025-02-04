const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const morgan = require("morgan");
const ErrorRoute = require("./utils/error");
const authRouter = require("./routes/authrouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/auth", authRouter);
app.use(morgan("dev"));
app.use(ErrorRoute);

module.exports = app;
