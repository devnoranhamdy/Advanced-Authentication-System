const { check } = require("express-validator");
const User = require("../../models/user.js");
const ApiError = require("../ApiError.js");
const validationMiddleWare = require("../../middelware/validationError.js");

const checkUserId = () => {
  return check("userId")
    .isMongoId()
    .withMessage("invalid id format")
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        return Promise.reject(new ApiError("user not exist!", 400));
      }
      return true;
    });
};

const checkUserExists = () => {
  return check("email").custom(async (email) => {
    const user = await User.findOne({email});
    if (user) {
      return Promise.reject(new ApiError("user already exist!", 400));
    }
    return true;
  });
};

exports.validateGetSpecificUser = [checkUserId(), validationMiddleWare];
exports.validateDeleteUser = [checkUserId(), validationMiddleWare];
exports.validateCreateUser = [
  check("name")
  .notEmpty()
  .withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
  check("password")
  .notEmpty()
  .withMessage("Password is required"),
  checkUserExists(),
  validationMiddleWare,
];
exports.validateUpdateUser = [
    check("name")
    .optional(),
    check("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email"),
    check("password")
    .optional()
    ,checkUserExists()
    ,checkUserId(), validationMiddleWare
];

