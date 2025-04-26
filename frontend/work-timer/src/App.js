import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { isAuthenticated } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  
  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        // Get user info from localStorage if it exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };
    
    checkAuth();
  }, []);
  
  // Enhanced setUser function that also stores in localStorage
  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };
  
  return (
    <div className="App">
      <Routes>
        <Route 
          path="/"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login setUser={handleSetUser}/> : <Navigate to="/dashboard"/>}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard"/>}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role !== 'admin' ? 
                <Dashboard user={user} setUser={handleSetUser}/> : 
                <AdminDashboard setUser={handleSetUser}/>
            ) : (
              <Navigate to='/login' />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;