const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "API Running"
  });
});

app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;     