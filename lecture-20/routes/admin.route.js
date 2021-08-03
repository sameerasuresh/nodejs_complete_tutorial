const express = require('express');
const router = express.Router({caseSensitive: true});
const path = require("path");
const adminController = require('../controllers/admin.controller') ;
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

///admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.get('/products', isAuth, adminController.getProducts);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = router;