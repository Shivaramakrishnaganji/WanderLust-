const mongoose= require("mongoose");
const Schema=mongoose.Schema;  // rewriting
const passportLocalMongoose = require("passport-local-mongoose").default;




const userSchema = new Schema({
    email:{
        type : String,
        required : true
    }
});

// passort-local-mongoose package automatically implemented username , salting , hashing buited implemented
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);