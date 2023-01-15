const { User } = require('../database');

const LocalStrategy = require('passport-local').Strategy;

exports.initializingPassport =(passport)=>{
    passport.use(new LocalStrategy(async(username,password,done)=>{
        const user = await User.findOne({username})
    }))
}