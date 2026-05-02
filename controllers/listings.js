const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const ExpressError = require("../utils/ExpressError.js");
const { sendSuccess } = require("../utils/apiResponse.js");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

const listingPopulateOptions = [
  { path: "owner", select: "username email" },
  {
    path: "reviews",
    populate: {
      path: "author",
      select: "username email",
    },
  },
];

const getListingPayload = async (req) => {
  const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const geometry = response.body.features[0] && response.body.features[0].geometry;
  if (!geometry) {
    throw new ExpressError(400, "Could not find coordinates for this location");
  }

  const listingPayload = { ...req.body.listing, geometry };

  if (req.file) {
    listingPayload.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  return listingPayload;
};

const findListingForApi = async (id) => {
  const listing = await Listing.findById(id).populate(listingPopulateOptions);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  return listing;
};

module.exports.apiIndex = async (req, res) => {
  const allListings = await Listing.find({}).populate("owner", "username email");
  return sendSuccess(res, allListings);
};

module.exports.apiShowListing = async (req, res) => {
  const listing = await findListingForApi(req.params.id);
  return sendSuccess(res, listing);
};

module.exports.apiCreateListing = async (req, res) => {
  const listingPayload = await getListingPayload(req);
  const newListing = new Listing(listingPayload);
  newListing.owner = req.user._id;

  const savedListing = await newListing.save();
  const listing = await findListingForApi(savedListing._id);
  return sendSuccess(res, listing, 201);
};

module.exports.apiUpdateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  const updatedListing = await findListingForApi(id);
  return sendSuccess(res, updatedListing);
};

module.exports.apiDestroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }

  return sendSuccess(res, { id });
};
