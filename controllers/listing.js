const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const MyError = require('../utils/MyError.js');
const { listingSchema } = require('../schema.js');

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listing/index.ejs", { allListings });
}

module.exports.renderNewListingForm = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.addingListing = async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;
    newListing.owner = req.user._id;
    await newListing.save();
    console.log("listing added successfully")
    req.flash("success", "New listing added successfully");
    res.redirect('/listing');
}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new MyError(500, "Invalid ID");

    let listing = await Listing.findById(id).
        populate({
            path: "reviews",
            populate: ({
                path: "author"
            })
        }).populate("owner");
    if (!listing) {
        req.flash('error', "listing you requested does not exist");
        return res.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });
}

module.exports.renderEditListingForm = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', "listing you requested does not exist");
        return res.redirect("/listing");
    }
    let originalUrl = listing.image.url.replace("/uplaod","/upload/w_250");
    res.render("listing/edit.ejs", { listing, originalUrl });
}

module.exports.updateListing = async (req, res) => {
    let result = listingSchema.validate(req.body);
    if (result.error)
        throw new MyError(400, result.error.message);
    let id = req.params.id;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if(typeof req.file !== "undefined"){
        updatedListing.image={
            url:req.file.path,
            filename:req.file.filename
        }
        await updatedListing.save();
    }
    req.flash("success", "listing updated successfully");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async function (req, res) {
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash('error', "listing you requested does not exist");
        return res.redirect("/listing");
    }
    console.log(deletedListing);
    req.flash("success", "listing deleted successfully")
    res.redirect(`/listing`);
}