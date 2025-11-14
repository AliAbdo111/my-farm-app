import React from 'react';
import './CowStats.css';

function CowStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-container">
      <h2>إحصائيات المواشي</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">إجمالي المواشي</div>
          <div className="stat-value">{stats.totalCows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">المواشي المتاحة</div>
          <div className="stat-value">{stats.activeCows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">المواشي المباعة</div>
          <div className="stat-value">{stats.soldCows}</div>
        </div>
        <div className="stat-card stat-card-primary">
          <div className="stat-label">إجمالي سعر الشراء</div>
          <div className="stat-value">{stats.totalPurchasePrice.toLocaleString()} جنيه</div>
        </div>
        <div className="stat-card stat-card-primary">
          <div className="stat-label">إجمالي سعر البيع</div>
          <div className="stat-value">{stats.totalSalePrice.toLocaleString()} جنيه</div>
        </div>
        <div className={`stat-card ${stats.profit >= 0 ? 'stat-card-profit' : 'stat-card-loss'}`}>
          <div className="stat-label">الربح/الخسارة</div>
          <div className="stat-value">{stats.profit.toLocaleString()} جنيه</div>
        </div>
      </div>
    </div>
  );
}

export default CowStats;

