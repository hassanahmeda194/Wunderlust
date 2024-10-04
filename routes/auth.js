const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const AuthControllers = require("../controller/auth.js");

router.get("/sign-up", AuthControllers.renderSignupForm);
router.post("/sign-up", AuthControllers.handleSignup);
router.get("/login", AuthControllers.renderLoginForm);
router.post(
  "/submit-login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  AuthControllers.handleLogin
);
router.get("/logout", AuthControllers.handleLogout);

module.exports = router;
