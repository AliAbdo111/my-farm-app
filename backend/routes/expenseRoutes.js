const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');

// جميع المسارات تحتاج إلى مصادقة
router.use(authMiddleware);

// إنشاء مصروف جديد
router.post('/', createExpense);

// الحصول على جميع المصروفات
router.get('/', getExpenses);

// الحصول على إحصائيات المصروفات
router.get('/stats', getExpenseStats);

// الحصول على مصروف محدد
router.get('/:id', getExpenseById);

// تحديث مصروف
router.put('/:id', updateExpense);

// حذف مصروف
router.delete('/:id', deleteExpense);

module.exports = router;

