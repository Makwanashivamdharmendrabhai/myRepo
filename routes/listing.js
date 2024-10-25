const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js');
const {isLoggedIn,isOwner,validateListing} = require("../midddleware.js");
const listingController  = require('../controllers/listing.js');
const multer = require("multer");
const {storage}= require("../cloudinaryConfig.js");
const upload = multer({storage});
router.get("/", wrapAsync(listingController.index));

router
    .route("/new")
    .get(isLoggedIn,listingController.renderNewListingForm)
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.addingListing));


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router
    .route("/:id/edit")
    .get(isLoggedIn,isOwner,wrapAsync(listingController.renderEditListingForm))
    .patch(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))

module.exports=router;