const express = require("express");
<<<<<<< HEAD
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
=======
const multer = require("multer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");

const router = express.Router();
const upload = multer({ storage });

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

function isApiLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      ok: false,
      message: "you must be logged in to continue",
    });
  }

  return next();
}

async function getListingOr404(id, res) {
  const listing = await Listing.findById(id);
  if (!listing) {
    res.status(404).json({
      ok: false,
      message: "Listing you requested for does not exists",
    });
    return null;
  }

  return listing;
}

function ensureOwnerOr403(listing, req, res) {
  if (!listing.owner.equals(req.user._id)) {
    res.status(403).json({
      ok: false,
      message: "You are not the owner of listing",
    });
    return false;
  }

  return true;
}

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.json({
      ok: true,
      listings: allListings,
    });
  })
);

router.post(
  "/",
  isApiLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {
    const geocodeResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const geometry = geocodeResponse.body.features[0] && geocodeResponse.body.features[0].geometry;

    if (!geometry) {
      return res.status(400).json({
        ok: false,
        message: "Unable to geocode location",
      });
    }

    const newListing = new Listing(req.body.listing);

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    newListing.owner = req.user._id;
    newListing.geometry = geometry;

    const savedListing = await newListing.save();

    return res.status(201).json({
      ok: true,
      message: "New Listing is Created!",
      listing: savedListing,
    });
  })
);

router.get(
  "/:id/edit",
  isApiLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await getListingOr404(id, res);
    if (!listing) return;

    if (!ensureOwnerOr403(listing, req, res)) return;

    let originalImageUrl = listing.image && listing.image.url ? listing.image.url : "";
    if (originalImageUrl) {
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }

    return res.json({
      ok: true,
      listing,
      originalImageUrl,
    });
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .populate("owner");

    if (!listing) {
      return res.status(404).json({
        ok: false,
        message: "Listing you requested for does not exists",
      });
    }

    res.json({
      ok: true,
      listing,
      mapToken: process.env.MAP_TOKEN || "",
    });
  })
);

router.put(
  "/:id",
  isApiLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await getListingOr404(id, res);
    if (!listing) return;

    if (!ensureOwnerOr403(listing, req, res)) return;

    Object.assign(listing, req.body.listing);

    if (typeof req.file !== "undefined") {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    return res.json({
      ok: true,
      message: "Listing is Updated!",
      listing,
    });
  })
);

router.delete(
  "/:id",
  isApiLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await getListingOr404(id, res);
    if (!listing) return;

    if (!ensureOwnerOr403(listing, req, res)) return;

    await Listing.findByIdAndDelete(id);

    return res.json({
      ok: true,
      message: " Listing is Deleted!",
      listingId: id,
    });
  })
);
>>>>>>> 9838c49 (migration from the EJS to Reactjs)

module.exports = router;
