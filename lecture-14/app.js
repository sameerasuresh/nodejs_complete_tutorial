const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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

const errorController = require('./controllers/errors.controller');

//const
MONGODB_URI = 'mongodb://127.0.0.1:27017/test?gssapiServiceName=mongodb';

const app = express();

//session store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

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

app.use((req, res, next)=> { 
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
            //next();
        })
});

//filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if(!user){
                const user = new User({
                    name: 'suresh',
                    email: 'email@email.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })
        const listener = app.listen(3000);
        //console.log(result);
        console.log('\x1b[32m','----------------------------------------------------------------');
        console.log(`Your server available: http://localhost:${listener.address().port}`);
        console.log('\x1b[32m','----------------------------------------------------------------','\x1b[0m');
    })
    .catch(err => {
        console.log(err);
    })



