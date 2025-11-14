import React, { useState, useEffect } from 'react';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseStats from './components/ExpenseStats';
import CowList from './components/CowList';
import CowForm from './components/CowForm';
import CowSellForm from './components/CowSellForm';
import CowStats from './components/CowStats';
import LoginForm from './components/LoginForm';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'cows'
  const [expenses, setExpenses] = useState([]);
  const [expenseStats, setExpenseStats] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [cows, setCows] = useState([]);
  const [cowStats, setCowStats] = useState(null);
  const [showCowForm, setShowCowForm] = useState(false);
  const [showCowSellForm, setShowCowSellForm] = useState(false);
  const [editingCow, setEditingCow] = useState(null);
  const [sellingCow, setSellingCow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (newToken) => {
    setToken(newToken);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const fetchExpenses = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/farm/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data);
      } else if (data.message && data.message.includes('مصادقة')) {
        // إذا كان هناك خطأ في المصادقة، قم بتسجيل الخروج
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseStats = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/farm/expenses/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setExpenseStats(data.data);
      } else if (data.message && data.message.includes('مصادقة')) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching expense stats:', error);
    }
  };

  const fetchCows = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/farm/cows`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setCows(data.data);
      } else if (data.message && data.message.includes('مصادقة')) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching cows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCowStats = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/farm/cows/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setCowStats(data.data);
      } else if (data.message && data.message.includes('مصادقة')) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching cow stats:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
      fetchExpenseStats();
      fetchCows();
      fetchCowStats();
    } else {
      setExpenses([]);
      setExpenseStats(null);
      setCows([]);
      setCowStats(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleExpenseFormClose = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
    fetchExpenses();
    fetchExpenseStats();
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/farm/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchExpenses();
        fetchExpenseStats();
      } else {
        alert(data.message || 'حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleAddCow = () => {
    setEditingCow(null);
    setShowCowForm(true);
  };

  const handleEditCow = (cow) => {
    setEditingCow(cow);
    setShowCowForm(true);
  };

  const handleCowFormClose = () => {
    setShowCowForm(false);
    setEditingCow(null);
    fetchCows();
    fetchCowStats();
  };

  const handleSellCow = (cow) => {
    setSellingCow(cow);
    setShowCowSellForm(true);
  };

  const handleCowSellFormClose = () => {
    setShowCowSellForm(false);
    setSellingCow(null);
    fetchCows();
    fetchCowStats();
  };

  const handleDeleteCow = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المواشي؟')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/farm/cows/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchCows();
        fetchCowStats();
      } else {
        alert(data.message || 'حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error deleting cow:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setExpenses([]);
    setExpenseStats(null);
    setCows([]);
    setCowStats(null);
  };

  // إذا لم يكن هناك token، عرض صفحة تسجيل الدخول
  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>إدارة المزرعة</h1>
          {user && (
            <p className="user-info">مرحباً، {user.name}</p>
          )}
        </div>
        <div className="header-actions">
          {activeTab === 'expenses' ? (
            <button onClick={handleAddExpense} className="btn btn-primary">
              + إضافة مصروف جديد
            </button>
          ) : (
            <button onClick={handleAddCow} className="btn btn-primary">
              + إضافة مواشي جديدة
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-secondary">
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          المصروفات
        </button>
        <button
          className={`tab ${activeTab === 'cows' ? 'active' : ''}`}
          onClick={() => setActiveTab('cows')}
        >
          المواشي
        </button>
      </div>

      {activeTab === 'expenses' && (
        <>
          {expenseStats && <ExpenseStats stats={expenseStats} />}
          {showExpenseForm && (
            <ExpenseForm
              expense={editingExpense}
              token={token}
              onClose={handleExpenseFormClose}
            />
          )}
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </>
      )}

      {activeTab === 'cows' && (
        <>
          {cowStats && <CowStats stats={cowStats} />}
          {showCowForm && (
            <CowForm
              cow={editingCow}
              token={token}
              onClose={handleCowFormClose}
            />
          )}
          {showCowSellForm && (
            <CowSellForm
              cow={sellingCow}
              token={token}
              onClose={handleCowSellFormClose}
            />
          )}
          <CowList
            cows={cows}
            loading={loading}
            onEdit={handleEditCow}
            onDelete={handleDeleteCow}
            onSell={handleSellCow}
          />
        </>
      )}
    </div>
  );
}

export default App;

