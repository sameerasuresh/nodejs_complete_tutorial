const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//mongoDB
const monogo = require('./utils/database');

const User = require('./models/user.model');

const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');

const errorController = require('./controllers/errors.controller');

app.set('view engine', 'ejs');

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=> { 
    User.findById('60ae536f664a000091004d14')
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user._id);
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



monogo.mongoConnect(() => {
    const listener = app.listen(3000);
    console.log('\x1b[32m','----------------------------------------------------------------');
    console.log('\x1b[32m','Server started port:',listener.address().port);
    console.log('\x1b[32m','----------------------------------------------------------------','\x1b[0m');
})



