const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}=require("./schema.js");
const { isApiRequest } = require("./utils/apiResponse.js");



module.exports.isLoggedIn=(req,res,next)=>{
    console.log("User data in middleware:", req.user);
    // req.path ..  req.OriginalUrl;
    if(!req.isAuthenticated()){
        if (isApiRequest(req)) {
            return next(new ExpressError(401, "You must be logged in"));
        }
        //rediectUrl save;
        req.session.redirectUrl=req.originalUrl;

        req.flash('error','you must be logged int to create Listing');
        return res.redirect('/login');
    }
    next();
}


module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner= async(req,res,next)=>{
          let {id}=req.params;
         let listing=await Listing.findById(id);
        if(!listing){
            return next(new ExpressError(404, "Listing not found"));
        }
        if(!listing.owner.equals(req.user._id)){
            if (isApiRequest(req)) {
                return next(new ExpressError(403, "You are not the owner of listing"));
            }
            req.flash('error',"You are not the owner of listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

module.exports.isReviewAuthor= async(req,res,next)=>{
          let {reviewId,id}=req.params;
         let review=await Review.findById(reviewId);
        if(!review){
            return next(new ExpressError(404, "Review not found"));
        }
        if(!review.author.equals(req.user._id)){
            if (isApiRequest(req)) {
                return next(new ExpressError(403, "You are not the author of review"));
            }
            req.flash('error',"You are not the author of review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};


//coustom function for the checking the validation of the input field data of Form


module.exports.validateListing = (req,res,next) =>{
     let {error}=listingSchema.validate(req.body);
     if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
         throw new ExpressError(400, errMsg);
    }else{
         next();
    }

};

module.exports.validateReview = (req,res,next) =>{
     let {error}=reviewSchema.validate(req.body);
     if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
         throw new ExpressError(400, errMsg);
    }else{
         next();
    }
};
