const Product = require('../models/product.model');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', 
    {
        docTitle: 'Add Product', 
        path: '/admin/edit-product',
        editing: false
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

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product=>{
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', 
        {
            docTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next)=>{
    const reqData = {
        id: req.body.id,
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
    }
    const updatedProduct = new Product(reqData);
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next )=>{
    const products = Product.fetchAll(products =>{
        res.render('admin/products', {
            prods: products,
            docTitle: 'Admin products',
            path: '/admin/products'
        });
    });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.delete(prodId);
    res.redirect('/admin/products');
}