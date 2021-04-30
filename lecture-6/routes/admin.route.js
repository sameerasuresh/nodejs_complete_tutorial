const express = require('express');
const router = express.Router();
const path = require("path");
const rootDir = require('../utils/path');

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    res.render('add-product', {docTitle: 'Add Product', path: '/admin/add-product'});
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    const localStore = [];
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;