const express = require('express');
const router = express.Router({caseSensitive: true});
const path = require("path");
const adminController = require('../controllers/admin.controller') ;

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

///admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct)

router.get('/products', adminController.getProducts);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);


module.exports = router;