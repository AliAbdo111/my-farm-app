import React from 'react';
import './ExpenseList.css';

const categoryNames = {
  rent: 'إيجار',
  land: 'أرض',
  plowing: 'حرث',
  doctor: 'طبيب',
  feed: 'علف',
  construction: 'بناء',
  maintenance: 'صيانة'
};

function ExpenseList({ expenses, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>لا توجد مصروفات حتى الآن</p>
        <p className="empty-hint">اضغط على "إضافة مصروف جديد" لبدء إضافة المصروفات</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="expense-list">
      <h2>قائمة المصروفات</h2>
      <div className="expenses-grid">
        {expenses.map((expense) => (
          <div key={expense._id} className="expense-card">
            <div className="expense-header">
              <span className="expense-category">
                {categoryNames[expense.category] || expense.category}
              </span>
              <span className="expense-amount">{expense.amount.toLocaleString()} جنيه</span>
            </div>
            <div className="expense-body">
              <div className="expense-field">
                <span className="field-label">الغرض:</span>
                <span className="field-value">{expense.purpose}</span>
              </div>
              <div className="expense-field">
                <span className="field-label">الإذن:</span>
                <span className="field-value">{expense.permission}</span>
              </div>
              {expense.notes && (
                <div className="expense-field">
                  <span className="field-label">ملاحظات:</span>
                  <span className="field-value">{expense.notes}</span>
                </div>
              )}
              <div className="expense-field">
                <span className="field-label">التاريخ:</span>
                <span className="field-value">{formatDate(expense.expenseDate)}</span>
              </div>
            </div>
            <div className="expense-actions">
              <button
                onClick={() => onEdit(expense)}
                className="btn btn-secondary"
              >
                تعديل
              </button>
              <button
                onClick={() => onDelete(expense._id)}
                className="btn btn-danger"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;

