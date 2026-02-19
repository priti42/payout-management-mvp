const mongoose = require('mongoose');

const payoutAuditSchema = new mongoose.Schema({
  payout_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payout',
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED'],
    required: true,
  },
  performed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PayoutAudit', payoutAuditSchema);

