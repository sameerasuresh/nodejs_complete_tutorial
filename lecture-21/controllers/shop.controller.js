const Product = require('../models/product.model');
const Order = require('../models/order.model');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 1;

exports.getProducts = async (req, res, next) => {
    let page;
    if(req.query.page){
        page = +req.query.page
    }else{
        page = 1;
    }
    let totalItems;
    Product.find()
    .countDocuments()
    .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
        .skip((page - 1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
        console.log(products);
        res.render('shop/product-list', 
        {
            prods: products,
            docTitle: 'Shop',
            path: '/products',
            totalItems: totalItems,
            hasNextPage: ITEMS_PER_PAGE*page < totalItems,
            hasPerviousPage: page > 1,
            nextPage: page+1,
            perviouspage: page-1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            currentPage: page
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
    let page;
    if(req.query.page){
        page = +req.query.page
    }else{
        page = 1;
    }
    let totalItems;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
            .skip((page - 1)*ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/index', 
            {
                prods: products,
                docTitle: 'Shop',
                path: '/',
                totalItems: totalItems,
                hasNextPage: ITEMS_PER_PAGE*page < totalItems,
                hasPerviousPage: page > 1,
                nextPage: page+1,
                perviouspage: page-1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                currentPage: page
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if(!order){
                return next(new Error('No order found!'));
            }
            if(order.user.userId.toString() !== req.user._id.toString()){
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-'+ orderId +'.pdf';
            const invoicePath = path.join('data','invoices', invoiceName);
/*             fs.readFile(invoicePath, (err, data) => {
                if(err){
                   return next(err);
                }
                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
                res.send(data);
            }); */
            
            const pdfDoc = new PDFDocument();
            //pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.fontSize(15).text('------------------------------------------------------------------------------------------');
            let total = 0
            order.products.forEach(prod => {
                let product = prod.product;
                let itemTotal = product.price * prod.quantity;
                total += itemTotal 
                pdfDoc.fontSize(20).text(product.title + ' :: ' + product.price + ' Rs' + ' x ' + prod.quantity + ' = ' + itemTotal);
            })
            pdfDoc.fontSize(15).text('------------------------------------------------------------------------------------------');
            pdfDoc.fontSize(26).text('Total - '+ total + ' Rs');
            pdfDoc.fontSize(15).text('------------------------------------------------------------------------------------------');

            pdfDoc.end();

            //const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf')
            // res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
             //file.pipe(res);
        })
        .catch(err => {
            next(err);
        });
}