const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const httpStatusText = require('./util/httpStatusText')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const passportSetup = require('./util/passportConfig')


const app = express()
const port = process.env.PORT 
const url = process.env.MONGODB_URL
const userRoter = require ('./routs/userRoute')

app.use(express.json())
app.use(cors())
app.use(cookieParser());


app.use(
    cookieSession({
      name: 'session',
      keys: [process.env.COOKIE_SECRET],
      maxAge: 7 * 24 * 60 * 60 * 1000 
    })
  );

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(url)
const DB = mongoose.connection

DB.on('error',()=>{
    console.log('Error on DB')
})

DB.once('open',()=>{
    console.log('Connected to DB ')
})

app.use(userRoter)
app.all('*',(req,res,next)=>{
    res.status(404).json({ status : httpStatusText.ERROR , message : ' This Page Not Found !'})
})


app.listen(port , ()=>{
    console.log('Application Running Successfully')
})