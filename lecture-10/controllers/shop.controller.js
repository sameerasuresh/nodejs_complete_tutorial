const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

exports.getProducts = (req, res, next) => {
   Product.fetchAll()
    .then(([rows, fields]) => {
        res.render('shop/product-list', 
        {
            prods: rows,
            docTitle: 'Shop',
            path: '/products'
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next)=>{
    Product.findById(req.params.productId)
        .then(([product, fields])=> {
            res.render('shop/product-detail',{
                docTitle: product[0].title,
                product: product[0],
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.getIndex = (req, res, next)=>{
    Product.fetchAll()
        .then(([rows, fields]) => {
            res.render('shop/index', 
            {
                prods: rows,
                docTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next)=>{
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(let product of products){
                const cartProductObj = cart.products.find(prod => prod.id == product.id)
                if(cartProductObj){
                    cartProducts.push({productData: product, qty: cartProductObj.qty});
                }
            }
            res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            products: cartProducts
        });
        });
    })
}

exports.postCart = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId, (product)=>{
        Cart.addProduct(prodId, product.price)
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
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