const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FarmUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String },
  refreshTokenExpires: { type: Date }
});

// تشفير كلمة المرور قبل الحفظ
FarmUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// مقارنة كلمة المرور
FarmUserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('FarmUser', FarmUserSchema);

