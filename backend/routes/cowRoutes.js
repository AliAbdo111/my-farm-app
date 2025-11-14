const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  createCow,
  getCows,
  getCowById,
  updateCow,
  sellCow,
  deleteCow,
  getCowStats
} = require('../controllers/cowController');

// جميع المسارات تحتاج إلى مصادقة
router.use(authMiddleware);

// إنشاء مواشي جديدة
router.post('/', createCow);

// الحصول على جميع المواشي
router.get('/', getCows);

// الحصول على إحصائيات المواشي
router.get('/stats', getCowStats);

// الحصول على مواشي محددة
router.get('/:id', getCowById);

// تحديث مواشي
router.put('/:id', updateCow);

// بيع مواشي
router.put('/:id/sell', sellCow);

// حذف مواشي
router.delete('/:id', deleteCow);

module.exports = router;

