// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './views/common/Header';
import LoginForm from './views/auth/LoginForm';
import UserDashboard from './views/dashboard/UserDashboard';
import AdminDashboard from './views/dashboard/AdminDashboard';
import LoadingSpinner from './views/common/LoadingSpinner';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Controllers
import AuthController from './controllers/AuthController';

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App component
const AppContent = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Check authentication on first load
  useEffect(() => {
    const checkAuthentication = async () => {
      await AuthController.checkAuth(setUser, setLoading);
    };
    
    checkAuthentication();
  }, [setUser]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? 
                  <Navigate to="/admin" replace /> : 
                  <UserDashboard />
                }
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
};

// Wrap the app with context providers
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;