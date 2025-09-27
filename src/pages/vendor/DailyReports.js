import React from 'react';
import Navigation from '../../components/Navigation';
import { useAuthState } from '../../hooks/useAuth';

const DailyReports = () => {
  const { userRole } = useAuthState();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Reports</h1>
          <p className="text-gray-600">Generate and view daily business reports</p>
          <div className="card mt-8">
            <p>Daily reports interface coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyReports;