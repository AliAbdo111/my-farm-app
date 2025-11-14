import React, { useState } from 'react';
import './CowSellForm.css';

function CowSellForm({ cow, token, onClose }) {
  const [formData, setFormData] = useState({
    exitDate: new Date().toISOString().split('T')[0],
    salePrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await fetch(`http://localhost:5000/api/farm/cows/${cow._id}/sell`, {
        method: 'PUT',
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
        setError(data.message || 'حدث خطأ أثناء البيع');
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
          <h2>بيع المواشي</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="cow-info">
          <p><strong>اللون:</strong> {cow.color}</p>
          <p><strong>السن:</strong> {cow.age} سنة</p>
          <p><strong>سعر الشراء:</strong> {cow.purchasePrice.toLocaleString()} جنيه</p>
        </div>

        <form onSubmit={handleSubmit} className="cow-sell-form">
          <div className="form-group">
            <label htmlFor="exitDate">تاريخ البيع *</label>
            <input
              type="date"
              id="exitDate"
              name="exitDate"
              value={formData.exitDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="salePrice">سعر البيع (جنيه) *</label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
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
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'جاري البيع...' : 'تأكيد البيع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CowSellForm;

