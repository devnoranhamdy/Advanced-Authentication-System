const express = require("express");
const httpStatusText = require("../../utils/httpStatusText");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const generateJwtandCookies = require("../../utils/generateJwtandCookies");
const send_Email = require("../../mailTrap/emails");
const genrate_OTP = require("../../utils/genrate_OTP");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const crypto = require("crypto");
const asyncHandellar = require("express-async-handler");

exports.signup = asyncHandellar(async (req, res) => {
  
  const {name , password ,role , email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const OTP_code = genrate_OTP();

  const newUser = new User({ name , password: hashedPassword , email , role , OTP: OTP_code, OTP_ExpiresAt: Date.now() + 5 * 60 * 1000,});
  const token = generateJwtandCookies.genrateJWT({ email: newUser.email,role: newUser.role,id: newUser._id,});
  newUser.token = token;

  await newUser.save();

  await send_Email.send_Auth_Email(newUser.email, newUser.OTP);
  return res.status(201) .json({ status: httpStatusText.SUCCESS, data: newUser  , message: "OTP sent to email. Please verify your account."});

});

exports.login = asyncHandellar(async (req, res) => {
  const { email, password , role} = req.body;
  const user = req.user;
  const matchedPassword = await bcrypt.compare(password, user.password);
  if ( matchedPassword) {
    const token = generateJwtandCookies.genrateJWT({ email: user.email,role: user.role,id: user._id,});
    generateJwtandCookies.setTokenInCookie(res, token);
    return res.status(200) .json({ status: httpStatusText.SUCCESS, message: { token } });
  } else {
    return res.status(400).json({status: httpStatusText.FAIL,message: "Wrong Email or Password",});
  }
});

exports.logout = asyncHandellar(async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({status: httpStatusText.SUCCESS,message: "Logged out successfuly",});
});

exports.verfiyEmail = asyncHandellar(async (req, res) => {
  const { OTP } = req.body;
  const findOTP = await User.findOne({
    OTP,
    OTP_ExpiresAt: { $gt: Date.now() },
  });
  
  if (!findOTP) {
    return res.status(400).json({status: httpStatusText.FAIL, message: "Enter Valid Verification Code !",});
  }

  findOTP.isValid = true;
  findOTP.OTP = undefined;
  findOTP.OTP_ExpiresAt = undefined;
  await findOTP.save();
  return res.status(200).json({status: httpStatusText.SUCCESS,message: " OTP added successfully"});
});

exports.forgotPassword = asyncHandellar(async (req, res) => {

  const OTP = genrate_OTP();
  const reset_Password_OTP = OTP;
  const reset_Password_ExpiresAt = Date.now() + 5 * 60 * 1000;

  finUser.reset_Password_OTP = reset_Password_OTP;
  finUser.reset_Password_ExpiresAt = reset_Password_ExpiresAt;

  const reset_Password_token = crypto.randomBytes(20).toString("hex");
  const reset_PasswordToken_ExpiresAt = Date.now() + 5 * 60 * 1000;

  finUser.reset_Password_token = reset_Password_token;
  finUser.reset_PasswordToken_ExpiresAt = reset_PasswordToken_ExpiresAt;

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${reset_Password_token}`;

  await finUser.save();

  await send_Email.send_reset_Email(
    finUser.email,
    finUser.reset_Password_OTP,
    resetLink
  );

  return res.status(200).json({ status: httpStatusText.SUCCESS, message: " Enter code sent to your email" });
});
exports.forgotPassword_verifyCode = asyncHandellar(async (req, res) => {
  const { reset_Password_OTP } = req.body;
  const checkOTP = await User.findOne({
    reset_Password_OTP,
    reset_Password_ExpiresAt: { $gt: Date.now() },
  });
  if (!checkOTP) {
    return res.status(400).json({  status: httpStatusText.FAIL,  message: "Enter Valid reset password Code !",});
  }

  checkOTP.isValid = false;
  checkOTP.reset_Password_OTP = undefined;
  checkOTP.reset_Password_ExpiresAt = undefined;
  await checkOTP.save();
});

exports.resetPassword = asyncHandellar(async (req, res) => {
  const {  newpassword, renterPassword } = req.body;
  if (newpassword !== renterPassword) {
    return res.status(400).json({ status: httpStatusText.FAIL,  data: null, message: "The passwords do not match. Please make sure both passwords are the same.",});
  }
  findUser.password = await bcrypt.hash(newpassword, 10);
  findUser.isValid = true;
  await findUser.save();
  return res.status(200).json({ status: "success", message: "Password updated successfully" });
});
