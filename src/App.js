import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Login';
import SignupPage from './Pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import UserManagement from './Components/users/UserManagement';

function App() {
  // Auth check function
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Auth Route wrapper (redirects to dashboard if already logged in)
  const AuthRoute = ({ children }) => {
    if (isAuthenticated()) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  // Mock user data - replace with actual user data from your auth system
  const currentUser = {
    id: 1,
    name: 'John Admin',
    email: 'john@example.com',
    role: 'admin'
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          } 
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout currentUser={currentUser}>
                <Routes>
                  <Route index element={<div>Dashboard Home</div>} />
                  <Route path="users" element={<UserManagement currentUser={currentUser} />} />
                  <Route path="profile" element={<div>Profile Page</div>} />
                  <Route path="roles" element={<div>Role Management</div>} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Root Redirect */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;