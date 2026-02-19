const express = require('express');
const { body } = require('express-validator');
const { verifyJWT } = require('../middlewares/auth');
const { listVendors, createVendor } = require('../controllers/vendorController');

const router = express.Router();

router.use(verifyJWT);

router.get('/', listVendors);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('upi_id').optional().isString(),
    body('bank_account').optional().isString(),
    body('ifsc').optional().isString(),
    body('is_active').optional().isBoolean(),
  ],
  createVendor
);

module.exports = router;

