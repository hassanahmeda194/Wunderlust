const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAuthor, validateReview } = require("../middleware");
const ReviewControllers = require("../controller/reviews.js");
const wrapAsync = require("../utils/wrapAsync");

// Route to create a new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewControllers.createReview)
);

// Route to delete a specific review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(ReviewControllers.deleteReview)
);

module.exports = router;
