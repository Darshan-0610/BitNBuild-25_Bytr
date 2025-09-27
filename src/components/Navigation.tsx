import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Home, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  QrCode, 
  User, 
  Bell,
  Package,
  Users,
  Menu,
  LogOut,
  Crown
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userType: 'customer' | 'admin';
  userData?: any;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, userType, userData, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const customerMenuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminMenuItems = [
    { id: 'admin', label: 'Dashboard', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr-scan', label: 'QR Scanner', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = userType === 'customer' ? customerMenuItems : adminMenuItems;

  const handleMenuClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Top Navigation */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-lg">🍱</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TiffinExpress</h1>
                <p className="text-xs text-gray-600 capitalize">{userType} Portal</p>
              </div>
            </div>

            {/* Desktop Menu Items */}
            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onNavigate(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {userData?.name?.charAt(0) || (userType === 'admin' ? 'A' : 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block">
                  <p className="text-sm font-medium text-gray-900">{userData?.name || `${userType} User`}</p>
                  <p className="text-xs text-gray-600">{userData?.email || `${userType}@tiffinexpress.com`}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-sm">🍱</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">TiffinExpress</h1>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col h-full">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {userData?.name?.charAt(0) || (userType === 'admin' ? 'A' : 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{userData?.name || `${userType} User`}</p>
                      <p className="text-sm text-gray-600">{userData?.email || `${userType}@tiffinexpress.com`}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {userType === 'admin' ? <Crown className="w-3 h-3 text-yellow-500" /> : <Users className="w-3 h-3 text-blue-500" />}
                        <span className="text-xs text-gray-500 capitalize">{userType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={currentPage === item.id ? 'default' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => handleMenuClick(item.id)}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Logout */}
                  <div className="border-t pt-4">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onLogout}>
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Simplified) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex items-center justify-around py-2">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center space-y-1 p-2 h-auto"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
