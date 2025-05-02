const express = require("express");
const httpStatusText = require("../../utils/httpStatusText");
const User = require("../../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const generateJwtandCookies = require("../../utils/generateJwtandCookies");
const send_Email = require("../../mailTrap/emails");
const genrate_OTP = require("../../utils/genrate_OTP");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const isStrongPassword = require("../../utils/strongPassword");
const crypto = require("crypto");
const asyncHandellar = require("express-async-handler");

exports.signupGoogle = asyncHandellar(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User signed up successfully",
    data: user,
  });
});

exports.signupFacebook = asyncHandellar(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User signed up successfully",
    data: user,
  });
});
