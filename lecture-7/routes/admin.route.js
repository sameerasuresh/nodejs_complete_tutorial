const express = require('express');
const router = express.Router();
const path = require("path");
const productsController = require('../controllers/products.controller') ;

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router