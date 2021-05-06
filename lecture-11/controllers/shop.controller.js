const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

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
            return cart.getProducts({where: {id: prodId}})
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