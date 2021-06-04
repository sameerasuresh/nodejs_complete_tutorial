const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//mongoDB
const mongoose = require('mongoose');

const User = require('./models/user.model');

const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');

const errorController = require('./controllers/errors.controller');

app.set('view engine', 'ejs');

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=> { 
    User.findById('60ba2a7de5f5da2cdc2759a7')
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

app.use(errorController.get404);

mongoose.connect('mongodb://127.0.0.1:27017/test?gssapiServiceName=mongodb')
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
        console.log('\x1b[32m','Server started port:',listener.address().port); 
        console.log('\x1b[32m','----------------------------------------------------------------','\x1b[0m');
    })
    .catch(err => {
        console.log(err);
    })



