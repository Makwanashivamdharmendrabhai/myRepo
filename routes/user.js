const express = require('express');
const router = express.Router({mergeparams:true});
const WrapAsync = require('../utils/WrapAsync.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../midddleware.js");
const userController  = require('../controllers/user.js');

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.userSignup))

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    WrapAsync(userController.userLogin)
    );

router.get("/logout", userController.userLogout)

module.exports = router;