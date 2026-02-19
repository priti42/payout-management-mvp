const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');

const listVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    next(err);
  }
};

const createVendor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const vendor = await Vendor.create({
      name: req.body.name,
      upi_id: req.body.upi_id,
      bank_account: req.body.bank_account,
      ifsc: req.body.ifsc,
      is_active: req.body.is_active,
    });

    res.status(201).json(vendor);
  } catch (err) {
    next(err);
  }
};

module.exports = { listVendors, createVendor };

