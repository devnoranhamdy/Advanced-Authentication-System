const express = require("express");
const {signupGoogle,signupFacebook,} = require("../../controllers/OAuth/oauthController");
const router = express.Router();
const passport = require("passport");


router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login" }),signupGoogle);

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback",passport.authenticate("facebook", { failureRedirect: "/login" }),signupFacebook);

module.exports = router;
