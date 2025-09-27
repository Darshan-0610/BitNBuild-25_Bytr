import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useAuthState } from '../hooks/useAuth';
import { 
  ShoppingCart, 
  CheckCircle, 
  Gift, 
  MapPin, 
  Clock, 
  Utensils, 
  TrendingUp 
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user, userRole } = useAuthState();
  const [mockData, setMockData] = useState({
    todaysOrder: {
      mealName: 'Dal Rice & Sabzi',
      status: 'confirmed',
      deliveryTime: '12:30 PM'
    },
    upcomingMeals: [
      { date: 'Tomorrow', meal: 'Chole Bhature', confirmed: false },
      { date: 'Day After', meal: 'Rajma Rice', confirmed: true },
    ],
    stats: {
      ordersThisMonth: 18,
      mealsSkipped: 3,
      favoriteVendor: 'Mumbai Tiffin Co.'
    }
  });

  const quickActions = [
    {
      title: 'Order Today\'s Meal',
      description: 'Place your meal order for today',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      path: '/customer/order'
    },
    {
      title: 'Confirm/Skip Tomorrow',
      description: 'Manage tomorrow\'s meal delivery',
      icon: CheckCircle,
      color: 'bg-green-500',
      path: '/customer/confirm'
    },
    {
      title: 'Festive Specials',
      description: 'Check out limited edition meals',
      icon: Gift,
      color: 'bg-purple-500',
      path: '/customer/specials'
    },
    {
      title: 'Track Delivery',
      description: 'See your delivery status',
      icon: MapPin,
      color: 'bg-orange-500',
      path: '/customer/tracking'
    }
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your tiffin service today.</p>
          </div>

          {/* Today's Order Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Today's Order</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mockData.todaysOrder.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {mockData.todaysOrder.status}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-tiffin-100 rounded-lg flex items-center justify-center">
                  <Utensils className="h-8 w-8 text-tiffin-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{mockData.todaysOrder.mealName}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Expected delivery: {mockData.todaysOrder.deliveryTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Orders</span>
                  <span className="font-semibold">{mockData.stats.ordersThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skipped</span>
                  <span className="font-semibold text-orange-600">{mockData.stats.mealsSkipped}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-gray-600">Favorite: {mockData.stats.favoriteVendor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div 
                    key={index} 
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.location.href = action.path}
                  >
                    <div className={`h-12 w-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Meals */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Meals</h2>
            <div className="space-y-3">
              {mockData.upcomingMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{meal.meal}</p>
                    <p className="text-sm text-gray-600">{meal.date}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    meal.confirmed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {meal.confirmed ? 'Confirmed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;