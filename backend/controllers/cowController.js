const FarmCow = require('../models/FarmCow');

// إنشاء مواشي جديدة
const createCow = async (req, res) => {
  try {
    const { age, color, ownership, partnershipPercentage, entryDate, purchasePrice, notes } = req.body;
    const userId = req.userId;

    // التحقق من الحقول المطلوبة
    if (!age || !color || !ownership || !entryDate || purchasePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة: السن، اللون، المالك، تاريخ الدخول، وسعر الشراء'
      });
    }

    const cow = new FarmCow({
      userId,
      age: Number(age),
      color,
      ownership,
      partnershipPercentage: partnershipPercentage ? Number(partnershipPercentage) : 100,
      entryDate: new Date(entryDate),
      purchasePrice: Number(purchasePrice),
      notes: notes || '',
      isSold: false
    });

    await cow.save();
    
    res.status(201).json({
      success: true,
      message: 'تم إضافة المواشي بنجاح',
      data: cow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المواشي',
      error: error.message
    });
  }
};

// الحصول على جميع المواشي
const getCows = async (req, res) => {
  try {
    const userId = req.userId;
    const { isSold, page = 1, limit = 10 } = req.query;

    const query = { userId };

    // فلترة حسب حالة البيع
    if (isSold !== undefined) {
      query.isSold = isSold === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const cows = await FarmCow.find(query)
      .sort({ entryDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FarmCow.countDocuments(query);

    res.json({
      success: true,
      data: cows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المواشي',
      error: error.message
    });
  }
};

// الحصول على مواشي محددة
const getCowById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const cow = await FarmCow.findOne({ _id: id, userId });

    if (!cow) {
      return res.status(404).json({
        success: false,
        message: 'المواشي غير موجودة'
      });
    }

    res.json({
      success: true,
      data: cow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المواشي',
      error: error.message
    });
  }
};

// تحديث مواشي
const updateCow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { age, color, ownership, partnershipPercentage, entryDate, purchasePrice, notes } = req.body;

    const cow = await FarmCow.findOne({ _id: id, userId });

    if (!cow) {
      return res.status(404).json({
        success: false,
        message: 'المواشي غير موجودة'
      });
    }

    // لا يمكن تعديل المواشي المباعة
    if (cow.isSold) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن تعديل المواشي المباعة'
      });
    }

    // تحديث الحقول
    if (age !== undefined) cow.age = Number(age);
    if (color) cow.color = color;
    if (ownership) cow.ownership = ownership;
    if (partnershipPercentage !== undefined) cow.partnershipPercentage = Number(partnershipPercentage);
    if (entryDate) cow.entryDate = new Date(entryDate);
    if (purchasePrice !== undefined) cow.purchasePrice = Number(purchasePrice);
    if (notes !== undefined) cow.notes = notes;

    await cow.save();

    res.json({
      success: true,
      message: 'تم تحديث المواشي بنجاح',
      data: cow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المواشي',
      error: error.message
    });
  }
};

// بيع مواشي
const sellCow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { exitDate, salePrice } = req.body;

    if (!exitDate || salePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'تاريخ البيع وسعر البيع مطلوبان'
      });
    }

    const cow = await FarmCow.findOne({ _id: id, userId });

    if (!cow) {
      return res.status(404).json({
        success: false,
        message: 'المواشي غير موجودة'
      });
    }

    if (cow.isSold) {
      return res.status(400).json({
        success: false,
        message: 'المواشي مباعة بالفعل'
      });
    }

    cow.isSold = true;
    cow.exitDate = new Date(exitDate);
    cow.salePrice = Number(salePrice);

    await cow.save();

    res.json({
      success: true,
      message: 'تم بيع المواشي بنجاح',
      data: cow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في بيع المواشي',
      error: error.message
    });
  }
};

// حذف مواشي
const deleteCow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const cow = await FarmCow.findOneAndDelete({ _id: id, userId });

    if (!cow) {
      return res.status(404).json({
        success: false,
        message: 'المواشي غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المواشي بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المواشي',
      error: error.message
    });
  }
};

// الحصول على إحصائيات المواشي
const getCowStats = async (req, res) => {
  try {
    const userId = req.userId;

    const cows = await FarmCow.find({ userId });

    const totalCows = cows.length;
    const soldCows = cows.filter(c => c.isSold).length;
    const activeCows = totalCows - soldCows;
    
    const totalPurchasePrice = cows.reduce((sum, c) => sum + c.purchasePrice, 0);
    const totalSalePrice = cows.filter(c => c.isSold).reduce((sum, c) => sum + (c.salePrice || 0), 0);
    const profit = totalSalePrice - totalPurchasePrice;

    res.json({
      success: true,
      data: {
        totalCows,
        activeCows,
        soldCows,
        totalPurchasePrice,
        totalSalePrice,
        profit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإحصائيات',
      error: error.message
    });
  }
};

module.exports = {
  createCow,
  getCows,
  getCowById,
  updateCow,
  sellCow,
  deleteCow,
  getCowStats
};

