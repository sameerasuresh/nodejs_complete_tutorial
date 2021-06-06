const Product = require('../models/product.model');

exports. getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', 
    {
        docTitle: 'Add Product', 
        path: '/admin/edit-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const reqData = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
        userId: req.user
    };
    const product = new Product(reqData);
    product.save()
        .then(result => {
            console.log("Created Product");
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if(!product){
                return res.redirect('/');
            }
            res.render('admin/edit-product', 
            {
                docTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postEditProduct = (req, res, next)=>{
    const reqData = {
        id: req.body.id,
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
    }

    Product.findById(reqData.id)
        .then(product => {
            product.title = reqData.title;
            product.imageUrl = reqData.imageUrl;
            product.description = reqData.description;
            product.price = reqData.price;
            product.__v = product.__v + 1;
            return product.save()
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res, next )=>{
    Product.find()
        // .populate('userId', 'name')
        // .select('title price -_id')
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                docTitle: 'Admin products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(deleteResult => {
            console.log('DESTROYED PRODUCT:');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}