const express = require('express');
const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');
const payoutRoutes = require('./payoutRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/payouts', payoutRoutes);

module.exports = router;
