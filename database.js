const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

exports.connectMongose = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("MongoDB conneceted ")
    })
    .catch((error)=>{
        console.log("Error while connecting mongoDB...",error)
    })
}


const userSchema = new mongoose.Schema({
    name:String,
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:String
})

exports.User = mongoose.model("User",userSchema);