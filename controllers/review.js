const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.addingReview = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = res.locals.currUser._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success',"new review added!!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully!!");
    res.redirect(`/listing/${id}`);
}