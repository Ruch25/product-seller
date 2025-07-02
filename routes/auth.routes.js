const express = require('express');
const router = express.Router();
const { adminLogin, sellerLogin } = require('../controller/auth.controller');
const { validateLogin } = require('../middleware/validate');



router.post('/admin/login', validateLogin, adminLogin);
router.post('/seller/login', validateLogin,sellerLogin);



module.exports = router;


