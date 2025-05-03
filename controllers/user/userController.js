const asyncHandellar = require('express-async-handler')
const User = require('../../models/user')
const httpStatusText = require ('../../utils/httpStatusText.js')
const bcrypt = require('bcrypt')
const generateJwtandCookies = require ('../../utils/generateJwtandCookies.js')

exports.getAllUsers = asyncHandellar ( async (req,res)=>{
    const { limit , page }=  req.query
    const numLimit = limit *1 || 20 ;
    const numPage = page *1 ||1;
    const skip = ( numPage - 1 ) * numLimit
    const users = await User.find({}, {'__v':0}).skip(skip).limit(limit)
    res.status(200).json({ status : httpStatusText.SUCCESS , length : users.length , data : users })

});
exports.getSpecificUser = asyncHandellar ( async (req,res)=>{
    const {userId } = req.params ;
    const user = await User.findById(userId) ;
    res.status(200).json({ status : httpStatusText.SUCCESS , data : user })
});
exports.createUser = asyncHandellar ( async (req,res)=>{
  const { name, email, password, role } = req.body;
  const hashedPassword =  await bcrypt.hash( password , 10)
  const newUser = new User ({ name, email, password : hashedPassword  , role  });
  const token = generateJwtandCookies.genrateJWT({email: newUser.email,role: newUser});
  newUser.token = token
  await newUser.save();
  res.status(200).json({ status : httpStatusText.SUCCESS ,message : 'user added successfuly ', data : newUser  })

});
exports.updateUser = asyncHandellar ( async (req,res)=>{
    const { userId } = req.params ;
    const user = await User.findByIdAndUpdate(userId , req.body , {new :true})
    res.status(200).json({ status : httpStatusText.SUCCESS ,message : 'user udated successfuly ', data : user })

});
exports.deleteUser = asyncHandellar ( async (req,res)=>{
    const { userId } = req.params ;
    await User.findByIdAndDelete(userId)
    res.status(200).json({ status : httpStatusText.SUCCESS ,message : 'user deleted successfuly'})

});