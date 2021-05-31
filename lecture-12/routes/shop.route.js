const express = require('express');
const router = express.Router({caseSensitive: true});
const path = require('path');
const fs = require('fs');
const shopController = require('../controllers/shop.controller')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item',shopController.postCartDeleteProduct);

router.get('/orders',shopController.getOrders);

router.post('/create-order', shopController.postOrder);

router.get('/checkout', shopController.getCheckout);

module.exports = router;