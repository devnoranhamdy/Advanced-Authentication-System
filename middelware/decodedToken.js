const User = require('../models/user')
const httpStatusText = require ('../utils/httpStatusText')
const ApiError = require('../utils/ApiError')
const asyncHandelar = require('express-async-handler')
const jwt = require('jsonwebtoken')
require("dotenv").config();


exports.protect = asyncHandelar(async (req, res , next )=>{

    let token 
    if(req.headers.authorization)
    {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token )
    {
    return next ( new ApiError ("Authentication required. Please login to continue." , 401 ))
    }
    const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY)
    const account = await User.findById(decodedToken.id)
    if(!account)
    {
         return next ( new ApiError ("The account associated with this token no longer exists." , 401 ))
    }
    
        req.user = account
           next()

});

exports.allowedTo = (...roles) => asyncHandelar(async (req, res , next )=>{

    if(!roles.includes(req.user.role))
    {
        return next ( new ApiError ("Access denied. You do not have permission to perform this action." , 403 ))
    }
    next()

    
});