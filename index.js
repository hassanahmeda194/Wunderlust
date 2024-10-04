require("dotenv").config();
console.log(process.env.SECRET);
// Import required modules and initialize the app
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();

// Setup view engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
  secret: "03136529768",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth.js");

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}
main().catch((err) => console.log(err));

app.get("/demo-user", async (req, res) => {
  let fakeUser = new User({
    email: "johndeo@gmail.com",
    username: "john-deo",
  });
  let newUser = await User.register(fakeUser, "password");
  res.send(newUser);
});
// Routes setup
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
