const express = require("express");
const {signupGoogle,signupFacebook,} = require("../../controllers/OAuth/oauthController");
const router = express.Router();
const passport = require("passport");


router.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/login" }),signupGoogle);

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback",passport.authenticate("facebook", { failureRedirect: "/login" }),signupFacebook);

module.exports = router;
