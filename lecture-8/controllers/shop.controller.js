const Product = require('../models/product.model');

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products =>{
        res.render('shop/product-list', 
        {
            prods: products,
            docTitle: 'Shop',
            path: '/products'
        });
    });
}

exports.getIndex = (req, res, next)=>{
    const products = Product.fetchAll(products =>{
        res.render('shop/index', 
        {
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
    });
}

exports.getCart = (req, res, next)=>{
    res.render('shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart'
    });
}

exports.getOrders = (req, res, next) =>{
    res.render('shop/orders',{
        docTitle: 'Your Orders',
        path: '/orders'
    });
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout',{
        docTitle: 'Checkout',
        path: '/checkout'
    });
}