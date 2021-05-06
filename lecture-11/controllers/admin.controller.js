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
        userId: req.user.id
    };
    req.user.createProduct(reqData)
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
    req.user.getProducts({where: {id: prodId}})
    //Product.findByPk(prodId)
        .then(products => {
            res.render('admin/edit-product', 
            {
                docTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: products[0]
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

    Product.findByPk(reqData.id)
        .then(product => {
            product.title = reqData.title;
            product.price = reqData.price;
            product.description = reqData.description;
            product.imageUrl = reqData.imageUrl;
            return product.save()
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            //console.log(result[0]);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res, next )=>{
    req.user.getProducts()
    //Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                docTitle: 'Admin products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DESTROYED PRODUCT');
            //console.log(result.dataValues);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}