const express = require ('express')
const httpStatusText = require('../util/httpStatusText')
const User = require('../models/user')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const generateJwtandCookies = require('../util/generateJwtandCookies')
const  send_Email  = require ('../mailTrap/emails')
const genrate_OTP = require ('../util/genrate_OTP')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const isStrongPassword = require ('../util/strongPassword')
const crypto = require('crypto')


const register =(async(req , res)=>{
    try{

        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({ status : httpStatusText.FAIL , errors : errors.array()})
        }
        const {name , password , email , role  } = req.body

        if (!name || !password || !email || !role )
            {
               return  res.status(400).json({status : httpStatusText.FAIL , message : ' Enter All Required Fields'})
            }

        const findUser =  await User.findOne ( { email })  ;

        if (findUser)
        {
           return  res.status(400).json({status : httpStatusText.FAIL , message : 'Wrong Email or Password'})
        }
        if (!isStrongPassword(password)) {
            return res.status(400).json({
              status: httpStatusText.FAIL,
              message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            });
          }
         const hashedPassword =  await bcrypt.hash(password , 10);

         const OTP_code = genrate_OTP ();

         const newUser = 
          new User({ name , 
           password : hashedPassword ,
           email ,
           role ,
           OTP : OTP_code , 
           OTP_ExpiresAt : Date.now() + 5 * 60 *1000 })

         const token = generateJwtandCookies.genrateJWT({ email : newUser.email , role : newUser.role , id : newUser._id})
         newUser.token = token
        
         await newUser.save()

           try {
            await send_Email.send_Auth_Email(newUser.email, newUser.OTP); 
          } catch (emailError) {
            return res.status(500).json({ status: httpStatusText.ERROR, message: 'Error sending verification email', error: emailError.message });
          }
        
         return res.status(201).json({ status : httpStatusText.SUCCESS , data : newUser })


    }catch(error){
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }


});

const login =(async(req ,res)=>{
    try{

        const {email , password , role } = req.body ;
        const findUser =  await User.findOne({email})
        if (!findUser)
        {
            return  res.status(400).json({status : httpStatusText.FAIL , message : 'Wrong Email or Password'})

        }
        const matchedPassword = await  bcrypt.compare(password , findUser.password)
        if (findUser && matchedPassword )
        {
            const token = generateJwtandCookies.genrateJWT({ email : findUser.email , role : findUser.role , id : findUser._id})
            generateJwtandCookies.setTokenInCookie(res, token);
            return  res.status(200).json({status : httpStatusText.SUCCESS , message : {token}})

        }
        else{

            return  res.status(400).json({status : httpStatusText.FAIL , message : 'Wrong Email or Password'})
        }


    }catch(error){
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }

});

const logout = ( async(req,res)=>{
    try {
        res.clearCookie('token')
        return res.status(200).json({ status : httpStatusText.SUCCESS , message : 'Logged out successfuly' })
       
    }catch(error)
    {
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }

});

const verfiyEmail = ( async(req, res)=>{
    try{
        const { OTP } = req.body;
        const findOTP =  await User.findOne ({ OTP , OTP_ExpiresAt : { $gt : Date.now ()}})
        if (!findOTP)
        {
            return res.status(400).json({ status: httpStatusText.FAIL , message : 'Enter Valid Verification Code !'})
        }
          
        findOTP.isValid = true ;
        findOTP.OTP = undefined ;
        findOTP.OTP_ExpiresAt = undefined ;
        await findOTP.save();
        return res.status(200).json({ status: httpStatusText.SUCCESS, message : ' OTP added successfully'})

    }catch(error)
    {
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }
})

const forgotPassword = (async (req,res)=>{
    try {
         const { email } = req.body ;
         const finUser = await User.findOne({email})
         if (!finUser)
         {
            return res.status(400).json({ status: httpStatusText.FAIL , data : null , message : 'Email does not exist'})

         }
          const OTP = genrate_OTP()

          const reset_Password_OTP = OTP ;
          const reset_Password_ExpiresAt = Date.now() + 5 * 60 * 1000 ; 

          finUser.reset_Password_OTP  = reset_Password_OTP ;
          finUser.reset_Password_ExpiresAt = reset_Password_ExpiresAt ; 


         const reset_Password_token = crypto.randomBytes(20).toString('hex')
         const  reset_PasswordToken_ExpiresAt = Date.now() + 5 * 60 * 1000  

         finUser.reset_Password_token  = reset_Password_token  ;
         finUser.reset_PasswordToken_ExpiresAt = reset_PasswordToken_ExpiresAt ;

         const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${reset_Password_token}`;

        await  finUser.save()

          try {

            await send_Email.send_reset_Email(finUser.email, finUser.reset_Password_OTP ,resetLink); 

          } catch (Error) {

            return res.status(500).json({ status: httpStatusText.ERROR, message: 'Error sending reset email', error: Error.message });
          }

          return res.status(200).json({ status: httpStatusText.SUCCESS, message : ' Enter code sent to your email'})



    }catch(error)
    {
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }

})

const forgotPassword_verifyCode = (async( req, res)=>{
    try{

        const {reset_Password_OTP} = req.body ;
        const checkOTP =  await User.findOne({ reset_Password_OTP , reset_Password_ExpiresAt: { $gt : Date.now ()}})
        if (!checkOTP )
        {
            return res.status(400).json({ status: httpStatusText.FAIL , message : 'Enter Valid reset password Code !'})
        }

      
        checkOTP.isValid = false ;
        checkOTP.reset_Password_OTP = undefined ;
        checkOTP.reset_Password_ExpiresAt = undefined ; 
        await checkOTP.save()


    }catch(error)
    {
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }
})

const  resetPassword = (async (req, res)=> {
    try {
        const { email , newpassword , renterPassword } = req.body ; 
        const findUser =  await User.findOne ({ email})
        if (!findUser)
        {
            return res.status(400).json({ status: httpStatusText.FAIL , data : null , message : ' Entir valid email '})

        }
        if ( newpassword !== renterPassword)
        {
            return res.status(400).json({ status: httpStatusText.FAIL , data : null ,
                 message : 'The passwords do not match. Please make sure both passwords are the same.'})
        }
        if (!isStrongPassword(newpassword)) {
            return res.status(400).json({
              status: httpStatusText.FAIL,
              message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            });
          }
         findUser.password =  await bcrypt.hash(newpassword , 10) ;
         findUser.isValid = true  ;
         await findUser.save();
         return res.status(200).json({ status: 'success', message: 'Password updated successfully' });

    }catch(error)
    {
        res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

    }
})

const signupGoogle = (async (req, res) => {
    try {
    const user = req.user; 
    return res.status(200).json({status : httpStatusText.SUCCESS ,message: 'User signed up successfully',data : user });
   }catch(error)
{
    res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

}
  });

  const signupFacebook = (async (req, res) => {
    try {
    const user = req.user; 
    return res.status(200).json({status : httpStatusText.SUCCESS ,message: 'User signed up successfully',data : user });
   }catch(error)
{
    res.status(500).json({ status: httpStatusText.ERROR , data : null , message : error.message})

}
  });


module.exports= {
    login ,
    register ,
    logout , 
    verfiyEmail ,
    forgotPassword ,
    forgotPassword_verifyCode ,
    resetPassword ,
    signupGoogle ,
    signupFacebook
}
