const express = require ('express')
const {body , validationResult} = require('express-validator')
const userControllers = require('../controllers/userController')
const router = express.Router()
const userShema = require('../models/user')
const passport = require('passport');

router.post ('/login',userControllers.login );
router.post ('/register',
    [ 
    body('name').notEmpty().withMessage('ENTER FIRST AND SECOND NAME ' ).isLength({ min : 3}).withMessage('NTER Valid NAME '),
    body('email').notEmpty().withMessage('ENTER Valid Email ')
    ],
    userControllers.register);
router.post ('/logout', userControllers.logout);
router.post ('/verfiy-Email', userControllers.verfiyEmail);
router.post ('/forgot-password', userControllers.forgotPassword);
router.post ('/forgotPassword_verifyCode', userControllers.forgotPassword_verifyCode);
router.post ('/resetPassword', userControllers.resetPassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userControllers.signupGoogle);


router.get('/auth/facebook',passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), userControllers.signupFacebook);




module.exports =  router ;
