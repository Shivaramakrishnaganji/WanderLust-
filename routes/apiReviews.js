const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const router = express.Router();

function isApiLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      ok: false,
      message: "you must be logged in to continue",
    });
  }

  return next();
}

function validateApiReview(req, res, next) {
  const { error } = reviewSchema.validate({ review: req.body.review });
  if (error) {
    const message = error.details.map((item) => item.message).join(", ");
    return res.status(400).json({
      ok: false,
      message,
    });
  }

  return next();
}

router.post(
  "/",
  isApiLoggedIn,
  validateApiReview,
  wrapAsync(async (req, res) => {
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        ok: false,
        message: "listingId is required",
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        ok: false,
        message: "Listing not found",
      });
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    const savedReview = await Review.findById(newReview._id).populate("author");

    return res.status(201).json({
      ok: true,
      message: "New Review is Created!",
      review: savedReview,
    });
  })
);

router.delete(
  "/:reviewId",
  isApiLoggedIn,
  wrapAsync(async (req, res) => {
    const { reviewId } = req.params;
    const listingId = (req.body && req.body.listingId) || req.query.listingId;

    if (!listingId) {
      return res.status(400).json({
        ok: false,
        message: "listingId is required",
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        ok: false,
        message: "Review not found",
      });
    }

    if (!review.author.equals(req.user._id)) {
      return res.status(403).json({
        ok: false,
        message: "You are not the author of review",
      });
    }

    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    return res.json({
      ok: true,
      message: "Review is  Deleted!",
      reviewId,
    });
  })
);

module.exports = router;
