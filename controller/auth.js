const User = require("../models/user");
const passport = require("passport");

// Controller to render the sign-up form
module.exports.renderSignupForm = (req, res) => {
  res.render("auth/signup");
};

// Controller to handle sign-up form submission
module.exports.handleSignup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/sign-up");
  }
};

// Controller to render the login form
module.exports.renderLoginForm = (req, res) => {
  res.render("auth/login");
};

// Controller to handle login form submission
module.exports.handleLogin = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

// Controller to handle logout
module.exports.handleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
