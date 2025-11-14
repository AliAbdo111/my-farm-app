const mongoose = require('mongoose');

const FarmExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmUser', required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['rent', 'land', 'plowing', 'doctor', 'feed', 'construction', 'maintenance']
  },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  permission: { type: String, required: true },
  notes: { type: String },
  expenseDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

FarmExpenseSchema.index({ userId: 1, expenseDate: -1 });
FarmExpenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('FarmExpense', FarmExpenseSchema);

