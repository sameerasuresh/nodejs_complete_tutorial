/**
 * npm i --save express
 * npm i --save-dev nodemon (application auto restart)
 * npm i --save express-session (sessions)
 * npm i --save connect-mongodb-session (save session in mongodb)
 * npm i --save bcryptjs (password hashing)
 * npm i --save csurf (CSRF token)
 * npm i --save connect-flash (save values in session temporary)
 * npm i --save nodemailer (to send emails)
 * npm i --save express-validator (validation)
 */


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
//mongoose
const mongoose = require('mongoose');
//models
const User = require('./models/user.model');
//session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
//routes
const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');
const authRoutes = require('./routes/auth.route');
//controllers
const errorController = require('./controllers/errors.controller');
const { throws } = require('assert');

//const
MONGODB_URI = 'mongodb://127.0.0.1:27017/test?gssapiServiceName=mongodb';

const app = express();

//session store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

//csrf
const csrfProtection = csrf();

app.set('view engine', 'ejs');

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({ 
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    name: '_DSID'
}));

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next()
});

app.use((req, res, next)=> { 
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next()
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        })
});


//filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500)
app.use(errorController.get404);

//error handling middleware
app.use((error, req, res, next) => {
    res.status(500)
    .render('500', { docTitle: '500 Server error', path: '/500', isAuthenticated: req.isLoggedIn})
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        const listener = app.listen(3000);
        //console.log(result);
        console.log('\x1b[32m','----------------------------------------------------------------');
        console.log(`Your server available: http://localhost:${listener.address().port}`);
        console.log('\x1b[32m','----------------------------------------------------------------','\x1b[0m');
    })
    .catch(err => {
        console.log(err);
    })



