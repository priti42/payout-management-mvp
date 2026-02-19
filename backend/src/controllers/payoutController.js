const { validationResult } = require('express-validator');
const Payout = require('../models/Payout');

const createPayout = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const payout = await Payout.create({
      vendor_id: req.body.vendor_id,
      amount: req.body.amount,
      mode: req.body.mode,
      note: req.body.note,
      // status defaults to Draft
      decision_reason: req.body.decision_reason,
    });

    res.status(201).json(payout);
  } catch (err) {
    next(err);
  }
};

const listPayouts = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.vendor) {
      filter.vendor_id = req.query.vendor;
    }

    const payouts = await Payout.find(filter)
      .populate('vendor_id')
      .sort({ createdAt: -1 });

    res.json(payouts);
  } catch (err) {
    next(err);
  }
};

module.exports = { createPayout, listPayouts };

