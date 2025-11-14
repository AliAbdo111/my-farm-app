const FarmExpense = require('../models/FarmExpense');

// إنشاء مصروف جديد
const createExpense = async (req, res) => {
  try {
    const { category, amount, purpose, notes, expenseDate } = req.body;
    const userId = req.userId;

    // التحقق من الحقول المطلوبة
    if (!category || !amount || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة: الفئة، المبلغ، والغرض'
      });
    }

    // التحقق من أن الفئة صحيحة
    const validCategories = ['rent_land', 'plowing', 'doctor', 'feed', 'construction', 'maintenance', 'seeds'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'فئة المصروف غير صحيحة'
      });
    }

    const expense = new FarmExpense({
      userId,
      category,
      amount: Number(amount),
      purpose,
      notes: notes || '',
      expenseDate: expenseDate ? new Date(expenseDate) : new Date()
    });

    await expense.save();
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء المصروف بنجاح',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المصروف',
      error: error.message
    });
  }
};

// الحصول على جميع مصروفات المستخدم
const getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { userId };

    // فلترة حسب الفئة
    if (category) {
      query.category = category;
    }

    // فلترة حسب التاريخ
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) {
        query.expenseDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.expenseDate.$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const expenses = await FarmExpense.find(query)
      .sort({ expenseDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FarmExpense.countDocuments(query);

    res.json({
      success: true,
      data: expenses,
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
      message: 'خطأ في جلب المصروفات',
      error: error.message
    });
  }
};

// الحصول على مصروف محدد
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await FarmExpense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'المصروف غير موجود'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المصروف',
      error: error.message
    });
  }
};

// تحديث مصروف
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { category, amount, purpose, notes, expenseDate } = req.body;

    const expense = await FarmExpense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'المصروف غير موجود'
      });
    }

    // تحديث الحقول
    if (category) {
      const validCategories = ['rent_land', 'plowing', 'doctor', 'feed', 'construction', 'maintenance', 'seeds'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'فئة المصروف غير صحيحة'
        });
      }
      expense.category = category;
    }
    if (amount !== undefined) expense.amount = Number(amount);
    if (purpose) expense.purpose = purpose;
    if (notes !== undefined) expense.notes = notes;
    if (expenseDate) expense.expenseDate = new Date(expenseDate);

    await expense.save();

    res.json({
      success: true,
      message: 'تم تحديث المصروف بنجاح',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المصروف',
      error: error.message
    });
  }
};

// حذف مصروف
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await FarmExpense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'المصروف غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المصروف بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المصروف',
      error: error.message
    });
  }
};

// الحصول على إحصائيات المصروفات
const getExpenseStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    const query = { userId };
    
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) query.expenseDate.$gte = new Date(startDate);
      if (endDate) query.expenseDate.$lte = new Date(endDate);
    }

    const expenses = await FarmExpense.find(query);

    // حساب الإجمالي
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // حساب الإجمالي حسب الفئة
    const categoryStats = expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = { count: 0, total: 0 };
      }
      acc[exp.category].count += 1;
      acc[exp.category].total += exp.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalExpenses: expenses.length,
        totalAmount,
        categoryStats
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
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
};

