const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/WrapAsync.js');
const {isLoggedIn,isAuthor,validateReview} = require("../midddleware.js");
const reviewController = require("../controllers/review.js");

// adding review 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addingReview));

// delete route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;