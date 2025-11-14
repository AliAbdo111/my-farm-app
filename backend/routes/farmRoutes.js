const express = require('express');
const router = express.Router();
const expenseRoutes = require('./expenseRoutes');
const authRoutes = require('./authRoutes');
const cowRoutes = require('./cowRoutes');

// مسارات المصادقة
router.use('/auth', authRoutes);

// مسارات المصروفات
router.use('/expenses', expenseRoutes);

// مسارات المواشي
router.use('/cows', cowRoutes);

module.exports = router;

