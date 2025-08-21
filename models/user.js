const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRole");
const findOrCreate = require("mongoose-findorcreate");

const userShema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: {
      type: String,
      require: true,
      validate: [validator.isEmail, "Must Be Valid Email !"],
    },
    password: { type: String, require: true },
    role: {
      type: String,
      require: true,
      enum: [userRole.ADMIN, userRole.User],
    },
    avatar: { type: String },
    isValid: { type: Boolean, default: false },
    googleId: { type: String },
    facebookId: { type: String },
    reset_Password_OTP: String,
    reset_Password_ExpiresAt: Date,
    OTP: String,
    OTP_ExpiresAt: Date,
    reset_Password_token: String,
    reset_PasswordToken_ExpiresAt: Date,
  },
  { timestamps: true }
);

userShema.plugin(findOrCreate);

module.exports = mongoose.model("User", userShema);
