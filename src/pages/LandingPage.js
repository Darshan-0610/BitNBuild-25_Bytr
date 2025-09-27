import React from 'react';
import { User, Building2, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigateToLogin = (type) => {
    if (type === 'customer') {
      window.location.href = '/login';
    } else {
      window.location.href = '/vendor-login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiffin-50 via-white to-tiffin-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Tiffin Logistics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart food delivery platform with logistics optimization and waste reduction
          </p>
        </div>

        {/* Login Options */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Login */}
            <div 
              onClick={() => navigateToLogin('customer')}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer group border-2 border-transparent hover:border-tiffin-200"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Customer
                </h2>
                <p className="text-gray-600 mb-6">
                  Order tiffins, track deliveries, manage meal preferences, and enjoy fresh homemade food.
                </p>
                <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
                  <li>• Browse and order meals</li>
                  <li>• Daily meal confirmations</li>
                  <li>• Real-time delivery tracking</li>
                  <li>• Festive special menus</li>
                </ul>
                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 font-medium">
                  Customer Login
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Vendor Login */}
            <div 
              onClick={() => navigateToLogin('vendor')}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer group border-2 border-transparent hover:border-tiffin-200"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-tiffin-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-tiffin-200 transition-colors">
                  <Building2 className="w-8 h-8 text-tiffin-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Vendor
                </h2>
                <p className="text-gray-600 mb-6">
                  Manage your tiffin business, optimize delivery routes, and reduce food waste with AI analytics.
                </p>
                <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
                  <li>• Customer management</li>
                  <li>• Route optimization</li>
                  <li>• AI analytics & waste tracking</li>
                  <li>• Daily business reports</li>
                </ul>
                <div className="flex items-center justify-center text-tiffin-600 group-hover:text-tiffin-700 font-medium">
                  Vendor Login
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose Tiffin Logistics?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Waste Reduction</h4>
              <p className="text-sm text-gray-600">AI-powered demand prediction reduces food waste</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Routes</h4>
              <p className="text-sm text-gray-600">Optimized delivery routes for faster service</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-tiffin-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Management</h4>
              <p className="text-sm text-gray-600">Simple interface for both customers and vendors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;