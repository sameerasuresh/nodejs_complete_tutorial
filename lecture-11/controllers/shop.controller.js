const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

exports.getProducts = (req, res, next) => {

    Product.findAll()
    .then(products => {
        res.render('shop/product-list', 
        {
            prods: products,
            docTitle: 'Shop',
            path: '/products'
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next)=>{

/*     Product.findAll({where: {id: req.params.productId}})
        .then(product => {
            res.render('shop/product-detail',{
                docTitle: product[0].title,
                product: product[0],
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        }); */

    Product.findByPk(req.params.productId)
        .then(product => {
            res.render('shop/product-detail',{
                docTitle: product.title,
                product: product,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.getIndex = (req, res, next)=>{
    Product.findAll()
        .then(products => {
            res.render('shop/index', 
            {
                prods: products,
                docTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next)=>{
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            console.log('products all: ',products);
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next)=>{
    const prodId = req.body.productId;
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
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}})
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy()
        })
        .then((result)=> {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) =>{
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders',{
                docTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let fetchCart;
    req.user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = {quantity: product.cartItem.quantity};
                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchCart.setProducts(null);
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