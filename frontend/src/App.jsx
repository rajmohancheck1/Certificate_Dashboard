import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Shared Components
import Header from './components/shared/Header';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';

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

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Footer from './components/Footer/Footer';

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
    <AuthProvider>
      <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            {/* Citizen Routes */}
            <Route path="/dashboard" element={<Navigate to="/my-applications" />} />
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
              <Footer />
        
        
    </AuthProvider>
  );
}


export default App;