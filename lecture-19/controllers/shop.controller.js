const Product = require('../models/product.model');
const Order = require('../models/order.model');

exports.getProducts = (req, res, next) => {

    Product.find()
    .then(products => {
        console.log(products);
        res.render('shop/product-list', 
        {
            prods: products,
            docTitle: 'Shop',
            path: '/products'
        });
    })
    .catch(err => {
        //res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getProduct = (req, res, next)=>{

    Product.findById(req.params.productId)
        .then(product => {
            res.render('shop/product-detail',{
                docTitle: product.title,
                product: product,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            //res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}

exports.getIndex = (req, res, next)=>{
    Product.find()
        .then(products => {
            res.render('shop/index', 
            {
                prods: products,
                docTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            //res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
}

exports.getCart = (req, res, next)=>{
    req.user.populate('cart.items.productId').execPopulate()
        .then(user => {
            console.log('products all: ',user.cart.items);
            const products = user.cart.items;
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            //res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postCart = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId).then(product =>{
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            //res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

/*  
let fetchedCart;
    let newQty;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            if(!cart){
                req.user.createCart()
                    .then(newCart => {
                        fetchedCart = newCart;
                    })
                    .catch(err => console.log(err));
            }
            return fetchedCart.getProducts({where: {id: prodId}})
        })
        .then(products => {
            let product;
            if(products.length > 0){
                product = products[0]
            }
            newQty = 1;
            if(product){ 
                const oldQty = product.cartItem.quantity;
                newQty = oldQty + 1
                return product;
                //...
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            fetchedCart.addProduct(product, {through: {quantity: newQty}});
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err)); 
        */
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            //res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getOrders = (req, res, next) =>{
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render('shop/orders',{
                docTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            //res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId').execPopulate()
        .then(user => {
            console.log(user.cart.items);
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc }}
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout',{
        docTitle: 'Checkout',
        path: '/checkout'
    });
}