import React from 'react';
import './CowList.css';

function CowList({ cows, loading, onEdit, onDelete, onSell }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (cows.length === 0) {
    return (
      <div className="empty-state">
        <p>لا توجد مواشي حتى الآن</p>
        <p className="empty-hint">اضغط على "إضافة مواشي جديدة" لبدء إضافة المواشي</p>
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
    <div className="cow-list">
      <h2>قائمة المواشي</h2>
      <div className="cows-grid">
        {cows.map((cow) => (
          <div key={cow._id} className={`cow-card ${cow.isSold ? 'sold' : ''}`}>
            {cow.isSold && (
              <div className="sold-badge">مباع</div>
            )}
            <div className="cow-header">
              <div className="cow-info-main">
                <span className="cow-color">{cow.color}</span>
                <span className="cow-age">عمر: {cow.age} سنة</span>
              </div>
              <span className="cow-status">
                {cow.isSold ? 'مباع' : 'متاح'}
              </span>
            </div>
            <div className="cow-body">
              <div className="cow-field">
                <span className="field-label">المالك:</span>
                <span className="field-value">{cow.ownership}</span>
              </div>
              <div className="cow-field">
                <span className="field-label">نسبة الشراكة:</span>
                <span className="field-value">{cow.partnershipPercentage}%</span>
              </div>
              <div className="cow-field">
                <span className="field-label">تاريخ الدخول:</span>
                <span className="field-value">{formatDate(cow.entryDate)}</span>
              </div>
              <div className="cow-field">
                <span className="field-label">سعر الشراء:</span>
                <span className="field-value">{cow.purchasePrice.toLocaleString()} جنيه</span>
              </div>
              {cow.isSold && cow.exitDate && (
                <div className="cow-field">
                  <span className="field-label">تاريخ البيع:</span>
                  <span className="field-value">{formatDate(cow.exitDate)}</span>
                </div>
              )}
              {cow.isSold && cow.salePrice && (
                <div className="cow-field">
                  <span className="field-label">سعر البيع:</span>
                  <span className="field-value sale-price">{cow.salePrice.toLocaleString()} جنيه</span>
                </div>
              )}
              {cow.notes && (
                <div className="cow-field">
                  <span className="field-label">ملاحظات:</span>
                  <span className="field-value">{cow.notes}</span>
                </div>
              )}
            </div>
            <div className="cow-actions">
              {!cow.isSold && (
                <>
                  <button
                    onClick={() => onEdit(cow)}
                    className="btn btn-secondary"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onSell(cow)}
                    className="btn btn-success"
                  >
                    بيع
                  </button>
                </>
              )}
              <button
                onClick={() => onDelete(cow._id)}
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

export default CowList;

