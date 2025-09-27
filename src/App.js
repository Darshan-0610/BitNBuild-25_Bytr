import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Components
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import VendorLogin from './pages/VendorLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import TestVendorDashboard from './pages/TestVendorDashboard';

// Customer Pages
import MealOrdering from './pages/customer/MealOrdering';
import DailyConfirmation from './pages/customer/DailyConfirmation';
import FestiveSpecials from './pages/customer/FestiveSpecials';
import DeliveryTracking from './pages/customer/DeliveryTracking';

// Vendor Pages
import CustomerManagement from './pages/vendor/CustomerManagement';
import DeliveryRoutes from './pages/vendor/DeliveryRoutes';
import AIAnalytics from './pages/vendor/AIAnalytics';
import QRScanner from './pages/vendor/QRScanner';
import DailyReports from './pages/vendor/DailyReports';

// Hooks
import { useAuthState } from './hooks/useAuth';

// Components
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading, userRole } = useAuthState();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to={userRole === 'vendor' ? '/vendor' : '/customer'} />} />
          <Route path="/vendor-login" element={!user ? <VendorLogin /> : <Navigate to={userRole === 'vendor' ? '/vendor' : '/customer'} />} />
          
          {/* Protected Customer Routes */}
          <Route path="/customer" element={user && userRole === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
          <Route path="/customer/order" element={user && userRole === 'customer' ? <MealOrdering /> : <Navigate to="/login" />} />
          <Route path="/customer/confirm" element={user && userRole === 'customer' ? <DailyConfirmation /> : <Navigate to="/login" />} />
          <Route path="/customer/specials" element={user && userRole === 'customer' ? <FestiveSpecials /> : <Navigate to="/login" />} />
          <Route path="/customer/tracking" element={user && userRole === 'customer' ? <DeliveryTracking /> : <Navigate to="/login" />} />
          
          {/* Protected Vendor Routes */}
          <Route path="/vendor" element={user && userRole === 'vendor' ? <VendorDashboard /> : <Navigate to="/login" />} />
          <Route path="/vendor/customers" element={user && userRole === 'vendor' ? <CustomerManagement /> : <Navigate to="/login" />} />
          <Route path="/vendor/routes" element={user && userRole === 'vendor' ? <DeliveryRoutes /> : <Navigate to="/login" />} />
          <Route path="/vendor/analytics" element={user && userRole === 'vendor' ? <AIAnalytics /> : <Navigate to="/login" />} />
          <Route path="/vendor/scanner" element={user && userRole === 'vendor' ? <QRScanner /> : <Navigate to="/login" />} />
          <Route path="/vendor/reports" element={user && userRole === 'vendor' ? <DailyReports /> : <Navigate to="/login" />} />
          
          {/* Default Route */}
          <Route path="/" element={user ? <Navigate to={userRole === 'vendor' ? '/vendor' : '/customer'} /> : <LandingPage />} />
        </Routes>
      </Router>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;