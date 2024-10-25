const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs")
}

module.exports.userSignup = async(req,res) =>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email});
        let registerdUser =  await User.register(newUser,password);
        req.login(registerdUser,(err)=>{
            if(err) return next(err);
            req.flash('success',"New User Added Successfully!!");
            res.redirect("/listing");
        });
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("user/login.ejs");
}

module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    redirectUrl = redirectUrl.split('/review')[0];
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res) => {
    req.logout((err,next)=>{
        if(err) return next(err);
        req.flash("success", "You are now logged out");
        res.redirect("/listing");
    })
}