const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const upload = multer({ storage });

router.route("/")
  .get(wrapAsync(listingController.apiIndex))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.apiCreateListing)
  );

router.route("/:id")
  .get(wrapAsync(listingController.apiShowListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.apiUpdateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.apiDestroyListing));

module.exports = router;
