const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const MyError = require("./utils/MyError.js");

module.exports.validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body);
    console.log("validating listing");
    if (error) {
        console.log("error detected");
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new MyError(400, errMsg);
    }
    next();
}

module.exports.validateReview = (req,res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new MyError(400, errMsg);
    }
    next();
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Must Be Logged In");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res,next) => {
    if(req.session.redirectUrl)
        res.locals.redirectUrl = req.session.redirectUrl;
    next();
}

module.exports.isOwner = async function(req, res,next){
    let id = req.params.id;
    let listing = await Listing.findById(id);
    console.log(res.locals);
    if(!(listing.owner.equals(res.locals.currUser._id))){
        req.flash("error","you do not have permission to do this!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor = async function(req, res,next){
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}