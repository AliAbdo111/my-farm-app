import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

const categoryNames = {
  rent: 'إيجار',
  land: 'أرض',
  plowing: 'حرث',
  doctor: 'طبيب',
  feed: 'علف',
  construction: 'بناء',
  maintenance: 'صيانة'
};

function ExpenseForm({ expense, token, onClose }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    purpose: '',
    permission: '',
    notes: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category || '',
        amount: expense.amount || '',
        purpose: expense.purpose || '',
        permission: expense.permission || '',
        notes: expense.notes || '',
        expenseDate: expense.expenseDate 
          ? new Date(expense.expenseDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = expense
        ? `http://localhost:5000/api/farm/expenses/${expense._id}`
        : 'http://localhost:5000/api/farm/expenses';
      
      const method = expense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onClose();
      } else {
        setError(data.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{expense ? 'تعديل المصروف' : 'إضافة مصروف جديد'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="category">الفئة *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">اختر الفئة</option>
              {Object.entries(categoryNames).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">المبلغ (جنيه مصري) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose">الغرض *</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="permission">الإذن *</label>
            <input
              type="text"
              id="permission"
              name="permission"
              value={formData.permission}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expenseDate">تاريخ المصروف *</label>
            <input
              type="date"
              id="expenseDate"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">ملاحظات</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : (expense ? 'تحديث' : 'حفظ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;

