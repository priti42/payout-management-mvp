const { validationResult } = require('express-validator');
const Payout = require('../models/Payout');

const applyStatusTransition = (payout, targetStatus, { reason } = {}) => {
  const current = payout.status;

  const allowed = {
    Draft: ['Submitted'],
    Submitted: ['Approved', 'Rejected'],
  };

  const nextAllowed = allowed[current] || [];
  if (!nextAllowed.includes(targetStatus)) {
    const err = new Error(
      `Invalid status transition from ${current} to ${targetStatus}`
    );
    err.statusCode = 400;
    throw err;
  }

  payout.status = targetStatus;
  if (targetStatus === 'Rejected') {
    payout.decision_reason = reason || '';
  }

  return payout;
};

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

const submitPayout = async (req, res, next) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      const err = new Error('Payout not found');
      err.statusCode = 404;
      throw err;
    }

    applyStatusTransition(payout, 'Submitted');
    await payout.save();

    res.json(payout);
  } catch (err) {
    next(err);
  }
};

const approvePayout = async (req, res, next) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      const err = new Error('Payout not found');
      err.statusCode = 404;
      throw err;
    }

    applyStatusTransition(payout, 'Approved');
    await payout.save();

    res.json(payout);
  } catch (err) {
    next(err);
  }
};

const rejectPayout = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      const err = new Error('Payout not found');
      err.statusCode = 404;
      throw err;
    }

    applyStatusTransition(payout, 'Rejected', {
      reason: req.body.reason,
    });
    await payout.save();

    res.json(payout);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayout,
  listPayouts,
  submitPayout,
  approvePayout,
  rejectPayout,
};

