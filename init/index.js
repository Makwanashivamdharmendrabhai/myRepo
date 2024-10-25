const initdata=require("./data.js");
const Listing= require("../models/listing.js");
const mongoose = require('mongoose');

main().then(()=>{
    console.log("connected to Mongoose");
})
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

async function initdb() {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
        ...obj,
        owner:"670f5bcc3334523bff46428a",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data is intialized");
}

initdb();