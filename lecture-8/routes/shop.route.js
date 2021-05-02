const express = require('express');
const router = express.Router({caseSensitive: true});
const path = require('path');
const shopController = require('../controllers/shop.controller')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.get('/orders',shopController.getOrders)

router.get('/checkout', shopController.getCheckout);

module.exports = router;