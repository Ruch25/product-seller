
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const sellerRoutes = require('./seller.routes');
const productRoutes = require('./product.routes');


router.use('/auth', authRoutes);
router.use('/seller', sellerRoutes);
router.use('/product', productRoutes);

module.exports = router;