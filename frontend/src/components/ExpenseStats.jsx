import React from 'react';
import './ExpenseStats.css';

const categoryNames = {
  rent: 'إيجار',
  land: 'أرض',
  plowing: 'حرث',
  doctor: 'طبيب',
  feed: 'علف',
  construction: 'بناء',
  maintenance: 'صيانة'
};

function ExpenseStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-container">
      <h2>إحصائيات المصروفات</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">إجمالي المصروفات</div>
          <div className="stat-value">{stats.totalExpenses}</div>
        </div>
        <div className="stat-card stat-card-primary">
          <div className="stat-label">المبلغ الإجمالي</div>
          <div className="stat-value">{stats.totalAmount.toLocaleString()} جنيه</div>
        </div>
      </div>
      
      {stats.categoryStats && Object.keys(stats.categoryStats).length > 0 && (
        <div className="category-stats">
          <h3>المصروفات حسب الفئة</h3>
          <div className="category-list">
            {Object.entries(stats.categoryStats).map(([category, data]) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span className="category-name">{categoryNames[category] || category}</span>
                  <span className="category-count">{data.count} مصروف</span>
                </div>
                <div className="category-amount">{data.total.toLocaleString()} جنيه</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseStats;

