const jwt = require('jsonwebtoken');
const FarmUser = require('../models/FarmUser');

// إنشاء JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// تسجيل حساب جديد
const register = async (req, res) => {
  try {
    const { name, mobileNumber, password } = req.body;

    // التحقق من الحقول المطلوبة
    if (!name || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة: الاسم، رقم الجوال، وكلمة المرور'
      });
    }

    // التحقق من أن المستخدم غير موجود
    const existingUser = await FarmUser.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'رقم الجوال مستخدم بالفعل'
      });
    }

    // إنشاء مستخدم جديد
    const user = new FarmUser({
      name,
      mobileNumber,
      password
    });

    await user.save();

    // إنشاء token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: {
          id: user._id,
          name: user.name,
          mobileNumber: user.mobileNumber
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الحساب',
      error: error.message
    });
  }
};

// تسجيل الدخول
const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // التحقق من الحقول المطلوبة
    if (!mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'رقم الجوال وكلمة المرور مطلوبان'
      });
    }

    // البحث عن المستخدم
    const user = await FarmUser.findOne({ mobileNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'رقم الجوال أو كلمة المرور غير صحيحة'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'رقم الجوال أو كلمة المرور غير صحيحة'
      });
    }
    
    console.log(`✅ User login successful: ${user.mobileNumber}`);

    // إنشاء token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: user._id,
          name: user.name,
          mobileNumber: user.mobileNumber
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول',
      error: error.message
    });
  }
};

// الحصول على معلومات المستخدم الحالي
const getCurrentUser = async (req, res) => {
  try {
    const user = await FarmUser.findById(req.userId).select('-password');
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          mobileNumber: user.mobileNumber
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب معلومات المستخدم',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};

