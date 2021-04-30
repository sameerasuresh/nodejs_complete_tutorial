const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../utils/path')
const adminData = require('./admin.route');

router.get('/',(req, res, next) => {
    const products = adminData.products;
    res.render('shop', {prods: products, docTitle: 'Shop', path: '/'});
});

module.exports = router;