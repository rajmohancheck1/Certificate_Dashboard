import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Citizen Pages
import CertificateApplication from './pages/citizen/CertificateApplication';
import MyApplications from './pages/citizen/MyApplications';
import ApplicationDetails from './pages/citizen/ApplicationDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ApplicationManagement from './pages/admin/ApplicationManagement';

const PrivateRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        {/* Citizen Routes */}
        <Route path="/" element={<Navigate to="/my-applications" />} />
        <Route path="/apply" element={<CertificateApplication />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <PrivateRoute roles={['admin']}>
              <ApplicationManagement />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;