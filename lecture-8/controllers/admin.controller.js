const Product = require('../models/product.model');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', 
    {
        docTitle: 'Add Product', 
        path: '/admin/add-product',
        activeAddProduct: true,
        formCSS: true,
        productCSS: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const reqData = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
    }

    const product = new Product(reqData);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next )=>{
    const products = Product.fetchAll(products =>{
        res.render('admin/products', {
            prods: products,
            docTitle: 'Admin products',
            path: '/admin/products'
        });
    });
};