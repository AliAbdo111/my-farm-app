import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import './CowForm.css';

function CowForm({ cow, token, onClose }) {
  const [formData, setFormData] = useState({
    age: '',
    color: '',
    ownership: '',
    partnershipPercentage: 100,
    entryDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cow) {
      setFormData({
        age: cow.age || '',
        color: cow.color || '',
        ownership: cow.ownership || '',
        partnershipPercentage: cow.partnershipPercentage || 100,
        entryDate: cow.entryDate 
          ? new Date(cow.entryDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        purchasePrice: cow.purchasePrice || '',
        notes: cow.notes || ''
      });
    }
  }, [cow]);

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
      const url = cow
        ? `${API_BASE_URL}/api/farm/cows/${cow._id}`
        : `${API_BASE_URL}/api/farm/cows`;
      
      const method = cow ? 'PUT' : 'POST';

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
          <h2>{cow ? 'تعديل المواشي' : 'إضافة مواشي جديدة'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cow-form">
          <div className="form-group">
            <label htmlFor="age">السن (بالسنوات) *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">اللون *</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              placeholder="مثال: بني، أسود، أبيض"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownership">المالك *</label>
            <input
              type="text"
              id="ownership"
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="partnershipPercentage">نسبة الشراكة (%)</label>
            <input
              type="number"
              id="partnershipPercentage"
              name="partnershipPercentage"
              value={formData.partnershipPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="entryDate">تاريخ الدخول *</label>
            <input
              type="date"
              id="entryDate"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purchasePrice">سعر الشراء (جنيه) *</label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
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
              {loading ? 'جاري الحفظ...' : (cow ? 'تحديث' : 'حفظ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CowForm;

