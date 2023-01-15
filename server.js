const express = require('express');
const app = express();
const morgan = require('morgan')
const { connectMongose, User } = require('./database')
const passport = require("passport");
const { initializingPassport } = require('./passport/passportConfig');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Backend Initialization
require('dotenv').config();



//database Initialization
// require('./database')
connectMongose()

//midelware
app.use(express.json());
app.use(morgan('tiny'))

// implementing routes

app.get('/', (req, res) => {
    console.log("testing branch")
    res.json({ status: true })
})

initializingPassport(passport);

app.post("/register", async (req, res) => {

    try {
        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(req.body.password, salt)
        const user = await User.findOne({ username: req.body.username })
        if (user) return res.status(400).send("User aleray existe")
        const newUser = await User.create({ ...req.body, password: password });
        let privateKey = 'heheydudjdkdudydtdhdjdudhdyddkdidudydtdhdmdkdjdhdydhd'
            let params = { name: newUser.name, username: newUser.username }
            let token = jwt.sign(params, privateKey, { expiresIn: '300s' }) //expiresIn  "10h" "20d" "3s"
        if (newUser) res.status(201).send({ status: true, message: 'user created sucessfully',token})
    } catch (error) {
        console.log("errr-->", error)
        res.status(500).json({ status: false, message: error.message })
    }

})

let UserAuthantication = (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let privateKey = 'heheydudjdkdudydtdhdjdudhdyddkdidudydtdhdmdkdjdhdydhd'
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            res.status(401).json({status:false,message:'invalid token'})
            console.log(err);
        } else {

            next()
            console.log(decoded)
        }
    })
}

app.get('/userList', UserAuthantication, (req, res) => {
    try {
        let dummyArray = [{ name: 'rahul', emai: 'rahul@edulab.in' }, { name: 'rahul2', emai: 'rahul2@edulab.in' }]
        res.status(200).json({ status: true, message: 'scusses', data: dummyArray })
    } catch (e) {
        res.status(500).json({ status: false, message: e.message })
    }
})

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(400).send("User not found!!!")
        console.log('iserpass==>', user.password)
        let match = await bcrypt.compare(req.body.password, user.password)
        console.log(',atata===>', match)
        if (match) {
            let privateKey = 'heheydudjdkdudydtdhdjdudhdyddkdidudydtdhdmdkdjdhdydhd'
            let params = { name: user.name, username: user.username }
            let token = jwt.sign(params, privateKey, { expiresIn: '300s' }) //expiresIn  "10h" "20d" "3s"
            console.log(token)
            res.status(200).json({ status: true, message: "user login success", token })
        } else {

            res.status(400).json({ status: true, message: "password not match" })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }

})



app.listen(process.env.PORT, () => {
    console.log(`Server listening on :${process.env.PORT}`)
})