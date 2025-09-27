import React from 'react';
import { useAuthState } from '../hooks/useAuth';

const TestVendorDashboard = () => {
  const { user, userRole, loading } = useAuthState();
  
  console.log('TestVendorDashboard - User:', user);
  console.log('TestVendorDashboard - UserRole:', userRole);
  console.log('TestVendorDashboard - Loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
        Test Vendor Dashboard
      </h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Authentication Status</h2>
        <p>User: {user ? user.email : 'No user'}</p>
        <p>Role: {userRole || 'No role'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Vendor Features</h2>
        <ul>
          <li>Customer Management</li>
          <li>Route Optimization</li>
          <li>AI Analytics</li>
          <li>Daily Reports</li>
          <li>QR Scanner</li>
        </ul>
      </div>
    </div>
  );
};

export default TestVendorDashboard;