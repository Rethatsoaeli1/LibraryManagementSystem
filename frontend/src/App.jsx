
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Transactions from './pages/Transactions';
import Users from './pages/Users';

import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import MemberLogin from './pages/MemberLogin';

import './App.css';

// Protect the main application pages
function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem('loggedIn') === 'true' &&
    Boolean(localStorage.getItem('token'));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Main application layout
function AppLayout() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch books from MySQL
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/books', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books.');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  // Fetch transactions from MySQL
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/transactions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch transactions.');
        }
        return response.json();
      })
      .then(data => {
        setTransactions(data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  // Fetch users from MySQL
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users.');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data.map(user => ({
          ...user,
          membershipId: user.membership_id
        })));
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div className="app-container">

      <Sidebar />

      <main className="page-content">
        <Routes>

          <Route
            path="/"
            element={
              <Dashboard
                books={books}
                transactions={transactions}
                users={users}
              />
            }
          />

          <Route
            path="/books"
            element={
              <Books
                books={books}
                setBooks={setBooks}
              />
            }
          />

          <Route
            path="/transactions"
            element={
              <Transactions
                books={books}
                setBooks={setBooks}
                transactions={transactions}
                setTransactions={setTransactions}
              />
            }
          />

          <Route
            path="/users"
            element={
              <Users
                users={users}
                setUsers={setUsers}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

    </div>
  );
}

// Main App component
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public login pages */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/member-login"
          element={<MemberLogin />}
        />

        {/* Protected application pages */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
