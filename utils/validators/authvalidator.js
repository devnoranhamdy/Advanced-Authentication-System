const ApiError = require("../ApiError");
const validationMiddleWare = require("../../middelware/validationError");
const { check } = require("express-validator");
const User = require("../../models/user");
const StrongPassword = require("../strongPassword");
const userRole = require("../userRole");

const checkUserExists = () => {
  return check("email").custom(async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      return Promise.reject(new ApiError("Wrong Email or Password", 400));
    }
    return true;
  });
};

const checkUserNotExists = () => {
  return check("email").custom(async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      return Promise.reject(new ApiError("Wrong Email or Password", 400));
    }
    req.user = user;
    return true;
  });
};

const isStrongPassword = (fieldName = "password") =>
  check(fieldName).custom((value) => {
    if (!StrongPassword(value)) {
      throw new ApiError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        400
      );
    }
    return true;
  });

exports.validateSignup = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email"),
  check("role")
    .notEmpty()
    .withMessage("role is required")
    .isIn([userRole.ADMIN, userRole.User])
    .withMessage(`Role must be either ${userRole.ADMIN} or ${userRole.User}`),
  check("password").notEmpty().withMessage("role is required"),
  isStrongPassword("password"),checkUserExists(),
  validationMiddleWare,
];
exports.validateLogin = [
  check("email").isEmail().withMessage("Invalid email"),
  checkUserNotExists(),
  validationMiddleWare,
];
exports.validateForgotPassword = [
  check("email").isEmail().withMessage("Invalid email"),
  checkUserExists(),
  validationMiddleWare,
];
exports.validateResetPassword = [
  check("resetCode").notEmpty().withMessage("Reset code is required"),
  isStrongPassword("newPassword"),
  checkUserExists(),
  validationMiddleWare,
];

