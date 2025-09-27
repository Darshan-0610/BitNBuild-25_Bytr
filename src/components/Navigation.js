import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';
import { 
  Home, 
  ShoppingCart, 
  CheckCircle, 
  Gift, 
  MapPin, 
  Users, 
  Route, 
  BarChart3, 
  QrCode, 
  FileText, 
  LogOut,
  User
} from 'lucide-react';

const Navigation = ({ userRole }) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const customerNavItems = [
    { path: '/customer', icon: Home, label: 'Dashboard' },
    { path: '/customer/order', icon: ShoppingCart, label: 'Order Meals' },
    { path: '/customer/confirm', icon: CheckCircle, label: 'Daily Confirm' },
    { path: '/customer/specials', icon: Gift, label: 'Festive Specials' },
    { path: '/customer/tracking', icon: MapPin, label: 'Track Delivery' },
  ];

  const vendorNavItems = [
    { path: '/vendor', icon: Home, label: 'Dashboard' },
    { path: '/vendor/customers', icon: Users, label: 'Customers' },
    { path: '/vendor/routes', icon: Route, label: 'Delivery Routes' },
    { path: '/vendor/analytics', icon: BarChart3, label: 'AI Analytics' },
    { path: '/vendor/scanner', icon: QrCode, label: 'QR Scanner' },
    { path: '/vendor/reports', icon: FileText, label: 'Reports' },
  ];

  const navItems = userRole === 'vendor' ? vendorNavItems : customerNavItems;

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-tiffin-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Tiffin Logistics</h2>
            <p className="text-sm text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-tiffin-100 text-tiffin-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;