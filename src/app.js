const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRoute = require("./routes/users");
const sessionsRoute = require("./routes/sessions");

const allowlist = ["http://localhost:4200", "https://pollstar.hexmaster.nl"];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  let isDomainAllowed = whitelist.indexOf(req.header("Origin")) !== -1;

  if (isDomainAllowed) {
    // Enable CORS for this request
    corsOptions = { origin: true };
  } else {
    // Disable CORS for this request
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

const appPort = process.env.PORT || 3000;
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//app.use(cors(corsOptionsDelegate));

// expose the swagger.json OpenAPI definition
app.use(express.static(path.join(__dirname, "open-api")));

// Provide routes to different microservices
app.use("/", indexRouter);
app.use("/users", usersRoute);
//app.use("/sessions", sessionsRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
