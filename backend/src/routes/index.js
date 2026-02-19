const express = require('express');
const authRoutes = require('./authRoutes');
const vendorRoutes = require('./vendorRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);

module.exports = router;
