import React from 'react';
import Navigation from '../../components/Navigation';
import { useAuthState } from '../../hooks/useAuth';

const AIAnalytics = () => {
  const { userRole } = useAuthState();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Analytics</h1>
          <p className="text-gray-600">Demand prediction and waste tracking</p>
          <div className="card mt-8">
            <p>AI analytics dashboard coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAnalytics;