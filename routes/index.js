
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const sellerRoutes = require('./seller.routes');

router.use('/auth', authRoutes);
router.use('/seller', sellerRoutes);

module.exports = router;