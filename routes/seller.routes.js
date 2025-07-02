const express = require('express');
const router = express.Router();
const { createSeller,getSellers } = require('../controller/seller.controller');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

const { validateCreateSeller } = require('../middleware/validate');

router.post(
  '/create',
  authenticate,                
  authorizeRoles(['admin']), 
  validateCreateSeller, 
  createSeller         
);

router.get(
  '/list',
  authenticate,
  authorizeRoles(['admin']),
  getSellers
);
module.exports = router;
