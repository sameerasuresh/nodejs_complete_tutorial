const express = require('express');
const router = express.Router()
const {check, body} = require('express-validator/check');
const authController = require('../controllers/auth.controller');
const User = require('../models/user.model');

router.get('/login',authController.getLogin);
router.post('/login',
[
    body('email')
        .isEmail()
        .withMessage('please enter valid email')
        .normalizeEmail(),
    body('password', 'password has to be valid.')
        .isLength({min: 5})
        .isAlphanumeric()
        .trim()
],
 authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup',[
    check('email')
        .isEmail()
        .withMessage('Please enter the valid email')
        .custom((value, {req}) => {
            // if(value === 'test@test.com'){
            //     throw new Error("this email address is forbidden");
            // }
            // return true;
            return User.findOne({ email: value })
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email already exist');
                }
            });
            
        }).normalizeEmail(),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters'
    )
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword').trim().custom((value, {req})=> {
        if(value !== req.body.password){
            throw new Error('Password have to match!');
        }
        return true;
    })
    ]
    , authController.postSignup);

router.get('/reset',authController.getReset);
router.post('/reset',authController.postReset);
router.get('/reset/:token',authController.getNewPassword);
router.post('/new-password', authController.postNewPassword)
module.exports = router;