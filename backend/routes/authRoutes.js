const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  register,
  login,
  getCurrentUser
} = require('../controllers/authController');

// تسجيل حساب جديد
router.post('/register', register);

// تسجيل الدخول
router.post('/login', login);

// الحصول على معلومات المستخدم الحالي (يحتاج مصادقة)
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;

