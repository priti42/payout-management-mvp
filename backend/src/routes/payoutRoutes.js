const express = require('express');
const { body, query } = require('express-validator');
const { verifyJWT, requireRole } = require('../middlewares/auth');
const {
  createPayout,
  listPayouts,
  submitPayout,
  approvePayout,
  rejectPayout,
} = require('../controllers/payoutController');

const router = express.Router();

router.use(verifyJWT);

router.post(
  '/',
  [
    requireRole('OPS'),
    body('vendor_id').notEmpty().withMessage('vendor_id is required'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('amount must be a number greater than 0'),
    body('mode')
      .isIn(['UPI', 'IMPS', 'NEFT'])
      .withMessage('mode must be one of UPI, IMPS, NEFT'),
    body('note').optional().isString(),
    body('status')
      .optional()
      .isIn(['Draft', 'Submitted', 'Approved', 'Rejected'])
      .withMessage('invalid status'),
    body('decision_reason').optional().isString(),
  ],
  createPayout
);

router.get(
  '/',
  [
    query('status')
      .optional()
      .isIn(['Draft', 'Submitted', 'Approved', 'Rejected'])
      .withMessage('invalid status'),
    query('vendor').optional().isString(),
  ],
  listPayouts
);

router.post(
  '/:id/submit',
  [requireRole('OPS')],
  submitPayout
);

router.post(
  '/:id/approve',
  [requireRole('FINANCE')],
  approvePayout
);

router.post(
  '/:id/reject',
  [
    requireRole('FINANCE'),
    body('reason').trim().notEmpty().withMessage('reason is required'),
  ],
  rejectPayout
);

module.exports = router;

