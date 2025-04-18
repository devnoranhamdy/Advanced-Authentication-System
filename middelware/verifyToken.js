const jwt = require ('jsonwebtoken')
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if (!authHeader)
    {
        return res.status(401).json ({status :httpStatusText.SUCCESS ,data : 'token is required '})

    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY)
        req.decodedToken = decodedToken
        next();
       }
       catch(error)
       {
        return res.status(401).json ({status : httpStatusText.ERROR , data  :' invalid token'})
       }
    
}
module.exports = verifyToken
