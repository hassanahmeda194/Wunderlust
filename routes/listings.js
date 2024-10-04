const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingControllers = require("../controller/listings.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(ListingControllers.index));
router.get("/new", isLoggedIn, ListingControllers.renderNewForm);
router.get("/:id", wrapAsync(ListingControllers.showListing));
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(ListingControllers.createListing)
);
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingControllers.renderEditForm)
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(ListingControllers.updateListing)
);
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingControllers.deleteListing)
);

module.exports = router;
