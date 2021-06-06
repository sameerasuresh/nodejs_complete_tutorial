const User = require('../models/user.model');

exports.getLogin = (req, res, next) => {
/*     const isLoggedIn = req.get('Cookie')
        .split(';')[1]
        .trim()
        .split('=')[1]; */
        
    res.render('auth/login', { 
        docTitle: 'Login', 
        path: '/login',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('60ba2a7de5f5da2cdc2759a7')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            /**
             * normaly dont call the save method. but you want to ensure
             * saving the seesion in DB, set response after complete DB operation
             */ 
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        })
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}