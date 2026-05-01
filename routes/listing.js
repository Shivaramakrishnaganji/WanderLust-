const express=require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router=express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const {isLoggedIn , isOwner , validateListing}=require("../middleware.js");
//Implemetation of the passport's
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("../models/user.js");

//from controller importing the backend functionalityes

const listingController = require("../controllers/listings.js")

//coustom function for the checking the validation of the input field data of Form

// Multer
const multer  = require('multer')

const {storage}=require('../cloudConfig.js')

const upload = multer({ storage })



// //testing Lising
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My House",
//         description:"Beatduful",
//         price:100,
//         location:"Hyde",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample is Testing");
//     res.send("Successful testing");
// });



router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    // validateListing,
    upload.single('listing[image]'), 
    wrapAsync( listingController.createListing)
);

//New Rout      2
router.get("/new" , isLoggedIn, listingController.renderNewForm);




router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
     upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing) );






//Index Routing
// router.get("/",wrapAsync(listingController.index));





//Show Rout   1
// router.get("/:id", wrapAsync(listingController.showListing));



//Create Route
// router.post("/", 
//     isLoggedIn ,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );


//Edit 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


//  Update Rout
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// );


// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing) );


module.exports=router;
