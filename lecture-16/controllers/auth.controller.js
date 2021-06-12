const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
//send email- nodemailer
const nodemailer = require('nodemailer');
const path = require('path');

const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'bubbletute@gmail.com',
        pass: 'bubble@2021'
    },
    name: 'CyberShop'
});

exports.getLogin = (req, res, next) => {
/*     const isLoggedIn = req.get('Cookie')
        .split(';')[1]
        .trim()
        .split('=')[1]; */
    
    var message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }else{
        message = null;
    }
    res.render('auth/login', { 
        docTitle: 'Login', 
        path: '/login',
        errorMessage: message
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if(!user){
                req.flash('error', 'Invalid Email');
                res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch){
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        /**
                         * normaly dont call the save method. but you want to ensure
                         * saving the seesion in DB, set response after complete DB operation
                         */ 
                        return req.session.save(err => {
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid password');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', { 
        docTitle: 'Signup', 
        path: '/signup',
        errorMessage: message
    });
}
 /**
  * password hashing: npm i --save bcryptjs
  */
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if(userDoc){
                req.flash('error', 'Email exist already')
                return res.redirect('/signup');
            }
            
            return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            email: email,
                            password: hashedPassword,
                            cart: {items: []}
                        });
                        //return user.save();
                        return 'success';
                    })
                    .then(result => {
                        res.redirect('/login');
                        return ejs.renderFile(
                            path.join(require.main.path,'views','emails', 'signup-mail.ejs'),
                            {name: email}
                        );
                    })
                    .then(data => {
                        return transporter.sendMail({
                            to: email,
                            from: 'bubbletute@gmail.com',
                            subject: 'Signup Succeeded.',
                            html: data,
                            attachments: [
                                {
                                    filename: 'apple1.jpg',
                                    path: 'https://blogs-images.forbes.com/bethhoffman/files/2012/04/Apple.jpg'
                                }
                            ],
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    });
        })
        .catch(err => {
            console.log(err);
        });
}