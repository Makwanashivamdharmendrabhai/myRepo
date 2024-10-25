if(process.env.NODE_ENV !== 'production')
    require("dotenv").config();

// setting up express
const express = require('express');
const app = express();
const port = 3000;
let dbUrl = process.env.ATLASDB_URL;

app.listen(port, () => {
    console.log('listening on port ' + port);
});

// setting up mongoose
const mongoose = require('mongoose');
main().then(() => {
    console.log("connected to Mongoose");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


// requring and setting up neccesary connection
// setting up for more types of requests
let methodoverride = require('method-override');
app.use(methodoverride("_method"));

// setting up url encoding
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting up view engine and public folder
const engine = require('ejs-mate');
app.set('view engine', 'ejs');
app.engine('ejs', engine);
const path = require('path');
app.set("views", path.join(__dirname, 'views/Listings'));
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');
const mongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const store = mongoStore.create({
    mongoUrl : dbUrl,
    cryptoUrl : {
        secret:"supersecret"
    },
    touchAfter:24*3600
})
const sessionOptions = {
    store,
    secret:"supersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

store.on("error",(err)=>{
    console.log(err);
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter);
app.use("/",userRouter);

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
})

 