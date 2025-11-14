const jwt = require('jsonwebtoken');
const FarmUser = require('../models/FarmUser');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'لم يتم توفير رمز المصادقة' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await FarmUser.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'المستخدم غير موجود' 
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'رمز المصادقة غير صحيح' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'انتهت صلاحية رمز المصادقة' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'خطأ في المصادقة', 
      error: error.message 
    });
  }
};

module.exports = authMiddleware;

