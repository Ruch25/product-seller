const express = require('express');
const router = express.Router();
const { addProduct,getMyProducts,deleteProduct } = require('../controller/product.controller');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const { validateAddProduct,validateGetMyProducts } = require('../middleware/validate');

// Product Routes
router.post('/add', authenticate, authorizeRoles(['seller']), validateAddProduct, addProduct);
router.post('/list', authenticate, authorizeRoles(['seller']), validateGetMyProducts, getMyProducts);
router.delete('/delete/:id', authenticate, authorizeRoles(['seller']), deleteProduct);



module.exports = router;