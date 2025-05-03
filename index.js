const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const httpStatusText = require("./utils/httpStatusText");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require("cookie-session");
const passportSetup = require("./utils/passportConfig");
const dataBaseConnection = require("./config/dbConfig");
const morgan = require("morgan");

dataBaseConnection();

const app = express();
const port = process.env.PORT;

const authRoute = require('./routes/Auth/authRoute')
const oauthRoute = require('./routes/OAuth/oauthRoute')
const userRouter = require("./routes/user/userRoute");


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SECRET],
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth", authRoute)
app.use("/api/oauth", oauthRoute)
app.use("/api/user",userRouter );



app.all("*", (req, res, next) =>
  next(new ApiError("This Page Not Found!", 404))
);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message || "Internal Server Error",
    stack: error.stack,
  });
});

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection : ${error.message} & ${error.name}`);
});

app.listen(port, () => {
  console.log("Application Running Successfully");
});
