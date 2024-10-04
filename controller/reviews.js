const Listing = require("../models/listing");
const Review = require("../models/review");

// Controller to create a new review
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
};

// Controller to delete a specific review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
