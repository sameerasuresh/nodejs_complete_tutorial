const express = require('express');
const shopRoute = require('./shop.route');
const authRoute = require('./auth.route');
const adminRoute = require('./admin.route');
const router = express.Router();

router.use('/admin',adminRoute);
router.use(shopRoute);
router.use(authRoute);

module.exports = router;