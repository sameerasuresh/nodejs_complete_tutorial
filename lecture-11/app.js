const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//models
const Product = require('./models/product.model');
const User = require('./models/user.model');
const CartItem = require('./models/cart-item.model');
const Cart = require('./models/cart.model');

//sequelize
const sequelize = require('./utils/database');


const app = express();

const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');

const errorController = require('./controllers/errors.controller');

app.set('view engine', 'ejs');

app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=> {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

//filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Relationships
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem, foreignKey:{name: 'cartIdx'}});
Product.belongsToMany(Cart, {through: CartItem, foreignKey: {name: 'productIdx'}});

sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        //console.log(result);
        return User.findByPk(1);
    }).
    then(user => {
        if(!user){
           return User.create({name: 'Suresh', email: 'test@test.com'})
        }
        return user
    })
    .then(user => {
        app.listen(3000);
    })
    .catch(err=> {
        console.log(err);
    });

