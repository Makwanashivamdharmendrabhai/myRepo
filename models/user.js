const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: 'string',
        required: true
    }
});

// Plugin to add the authenticate method and other helper methods
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;