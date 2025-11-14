const mongoose = require('mongoose');

const FarmCowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmUser', required: true },
  age: { type: Number, required: true },
  color: { type: String, required: true },
  ownership: { type: String, required: true },
  partnershipPercentage: { type: Number, default: 100, min: 0, max: 100 },
  entryDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  isSold: { type: Boolean, default: false },
  exitDate: { type: Date },
  salePrice: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

FarmCowSchema.index({ userId: 1, entryDate: -1 });

module.exports = mongoose.model('FarmCow', FarmCowSchema);

