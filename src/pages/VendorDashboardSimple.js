import React from 'react';
import { useAuthState } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';
import { 
  Users, 
  Route, 
  BarChart3, 
  Package,
  FileText,
  QrCode,
  LogOut,
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  Recycle
} from 'lucide-react';

const VendorDashboard = () => {
  const { user, userRole, loading } = useAuthState();
  
  console.log('VendorDashboard - User:', user);
  console.log('VendorDashboard - UserRole:', userRole);
  console.log('VendorDashboard - Loading:', loading);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error('Error logging out');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to continue</p>
          <button 
            onClick={() => window.location.href = '/vendor-login'}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Customer Management',
      description: 'View and manage customers',
      icon: Users,
      color: 'bg-blue-500',
      path: '/vendor/customers'
    },
    {
      title: 'Delivery Routes',
      description: 'Optimize delivery routes',
      icon: Route,
      color: 'bg-green-500',
      path: '/vendor/routes'
    },
    {
      title: 'AI Analytics',
      description: 'Demand & waste tracking',
      icon: BarChart3,
      color: 'bg-purple-500',
      path: '/vendor/analytics'
    },
    {
      title: 'Daily Reports',
      description: 'Generate business reports',
      icon: FileText,
      color: 'bg-orange-500',
      path: '/vendor/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹5,280</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Waste Reduced</p>
                <p className="text-2xl font-bold text-gray-900">15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => window.location.href = action.path}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Dal Rice Combo x2</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹240</p>
                  <p className="text-xs text-green-600">Delivered</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Jane Smith</p>
                  <p className="text-sm text-gray-600">South Indian Thali</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹150</p>
                  <p className="text-xs text-blue-600">Preparing</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mike Johnson</p>
                  <p className="text-sm text-gray-600">Punjabi Chole x3</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹420</p>
                  <p className="text-xs text-yellow-600">En Route</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="font-medium text-green-600">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On-time Delivery</span>
                  <span className="font-medium text-blue-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-medium text-gray-900">₹1,24,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Customers</span>
                  <span className="font-medium text-gray-900">186</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;