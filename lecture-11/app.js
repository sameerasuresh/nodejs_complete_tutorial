const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

//models
const Product = require('./models/product.model');
const User = require('./models/user.model');
const CartItem = require('./models/cart-item.model');
const Cart = require('./models/cart.model');
const Order = require('./models/order.model');
const OrderItem = require('./models/order-item.mode');


//sequelize
const sequelize = require('./utils/database');


const app = express();

const adminRoutes = require('./routes/admin.route')
const shopRoutes = require('./routes/shop.route');

const errorController = require('./controllers/errors.controller');
const { log } = require('console');

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

Cart.belongsToMany(Product, {through: CartItem, foreignKey:{name: 'cartId'}});
Product.belongsToMany(Cart, {through: CartItem, foreignKey: {name: 'productId'}});

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem}); 

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
        const listener = app.listen(3000);
        console.log('\x1b[32m','----------------------------------------------------------------');
        console.log('\x1b[32m','Server started port:',listener.address().port);
        console.log('\x1b[32m','----------------------------------------------------------------','\x1b[0m');
    })
    .catch(err=> {
        console.log(err);
    });

