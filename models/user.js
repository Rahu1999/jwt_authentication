const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    username:{
        type:String,
        required:true,
        unique:true
    },
    passsword:String
})

exports.User = mongoose.model("User",userSchema);