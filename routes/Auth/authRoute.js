const express = require("express");
const {login,signup,logout,verfiyEmail, forgotPassword,forgotPassword_verifyCode,resetPassword,} = require("../../controllers/Auth/authController")
const {validateSignup ,validateLogin , validateForgotPassword , validateResetPassword } = require ('../../utils/validators/authvalidator')
const router = express.Router();

router.post("/login", validateLogin,login);
router.post("/signup", validateSignup ,signup);
router.post("/logout", logout);
router.post("/verfiy-Email", verfiyEmail);
router.post("/forgot-password", validateForgotPassword,forgotPassword);
router.post("/forgotPassword_verifyCode", forgotPassword_verifyCode);
router.post("/resetPassword", validateResetPassword ,resetPassword);



module.exports = router;
