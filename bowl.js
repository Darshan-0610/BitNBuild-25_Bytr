import React, { useState, useEffect, createContext, useContext } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  preferences?: {
    dietary: string[];
    spiceLevel: number;
    allergies: string[];
    calorieTarget: number;
  };
  subscription?: {
    plan: 'daily' | 'weekly' | 'monthly';
    status: 'active' | 'paused' | 'cancelled';
    nextRenewal: string;
  };
}

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary: 'veg' | 'non-veg';
  spiceLevel: number;
  calories: number;
  ingredients: string[];
  isSpecial: boolean;
  isAvailable: boolean;
}

interface Order {
  id: string;
  userId: string;
  meals: { mealId: string; quantity: number; customization?: string }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  deliveryAddress: string;
  deliveryTime: string;
  orderDate: string;
  specialInstructions?: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'system' | 'promotional';
  isRead: boolean;
  createdAt: string;
}

interface DeliveryStaff {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number };
}

// Create context for shared state
interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  deliveryStaff: DeliveryStaff[];
  setDeliveryStaff: (staff: DeliveryStaff[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'orderDate'>) => void;
  login: (email: string, password: string, isAdmin?: boolean) => boolean;
  register: (name: string, email: string, password: string, isAdmin?: boolean) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample initial data
const initialMeals: Meal[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich tomato and butter sauce',
    price: 12.99,
    category: 'main-course',
    dietary: 'non-veg',
    spiceLevel: 2,
    calories: 650,
    ingredients: ['chicken', 'tomato', 'cream', 'spices'],
    isSpecial: false,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese cubes with spices',
    price: 10.99,
    category: 'appetizer',
    dietary: 'veg',
    spiceLevel: 1,
    calories: 420,
    ingredients: ['paneer', 'bell peppers', 'spices'],
    isSpecial: false,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Biryani',
    description: 'Fragrant rice dish with vegetables and spices',
    price: 14.99,
    category: 'main-course',
    dietary: 'veg',
    spiceLevel: 3,
    calories: 780,
    ingredients: ['rice', 'vegetables', 'spices'],
    isSpecial: true,
    isAvailable: true
  }
];

const initialOrders: Order[] = [
  {
    id: '1',
    userId: 'customer1',
    meals: [{ mealId: '1', quantity: 2 }],
    total: 25.98,
    status: 'delivered',
    deliveryAddress: '123 Main St, Apt 4B',
    deliveryTime: '2023-10-15T19:30:00',
    orderDate: '2023-10-15T18:00:00'
  }
];

const initialNotifications: Notification[] = [
  {
    id: '1',
    userId: 'customer1',
    title: 'Order Confirmed',
    message: 'Your order #123 has been confirmed and is being prepared.',
    type: 'order',
    isRead: false,
    createdAt: '2023-10-15T18:05:00'
  },
  {
    id: '2',
    userId: 'customer1',
    title: 'Festive Special',
    message: 'Check out our new festive special meals available for limited time!',
    type: 'promotional',
    isRead: false,
    createdAt: '2023-10-14T10:00:00'
  }
];

const initialDeliveryStaff: DeliveryStaff[] = [
  {
    id: '1',
    name: 'Raj Sharma',
    phone: '+91 9876543210',
    vehicle: 'Scooter',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Priya Singh',
    phone: '+91 9876543211',
    vehicle: 'Bike',
    isAvailable: false
  }
];

// Provider component
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('nourishnet-meals');
    return saved ? JSON.parse(saved) : initialMeals;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nourishnet-orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('nourishnet-notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [deliveryStaff, setDeliveryStaff] = useState<DeliveryStaff[]>(() => {
    const saved = localStorage.getItem('nourishnet-delivery-staff');
    return saved ? JSON.parse(saved) : initialDeliveryStaff;
  });

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('nourishnet-meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('nourishnet-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nourishnet-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nourishnet-delivery-staff', JSON.stringify(deliveryStaff));
  }, [deliveryStaff]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addMeal = (mealData: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...mealData,
      id: Date.now().toString()
    };
    setMeals(prev => [...prev, newMeal]);
    
    // Also add a notification for customers about the new meal
    if (mealData.isAvailable) {
      addNotification({
        userId: 'all',
        title: 'New Meal Added',
        message: `Check out our new ${mealData.name} now available!`,
        type: 'promotional',
        isRead: false
      });
    }
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals(prev => prev.map(meal => 
      meal.id === id ? { ...meal, ...updates } : meal
    ));
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'status' | 'orderDate'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'confirmed',
      orderDate: new Date().toISOString()
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Add notification for the order
    addNotification({
      userId: orderData.userId,
      title: 'Order Placed',
      message: `Your order #${newOrder.id} has been placed successfully.`,
      type: 'order',
      isRead: false
    });
  };

  const login = (email: string, password: string, isAdmin: boolean = false): boolean => {
    if (isAdmin) {
      if (email === 'admin123' && password === 'welcome123') {
        setCurrentUser({
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@nourishnet.com',
          role: 'admin'
        });
        return true;
      }
      return false;
    }
    
    // For customers, check localStorage
    const users = JSON.parse(localStorage.getItem('nourishnet-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'customer',
        preferences: user.preferences,
        subscription: user.subscription
      });
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, isAdmin: boolean = false): boolean => {
    if (isAdmin) {
      // Only allow admin registration with specific credentials
      return false;
    }
    
    const users = JSON.parse(localStorage.getItem('nourishnet-users') || '[]');
    
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      preferences: {
        dietary: [],
        spiceLevel: 2,
        allergies: [],
        calorieTarget: 2000
      },
      subscription: {
        plan: 'weekly',
        status: 'active',
        nextRenewal: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
    
    users.push(newUser);
    localStorage.setItem('nourishnet-users', JSON.stringify(users));
    
    setCurrentUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: 'customer',
      preferences: newUser.preferences,
      subscription: newUser.subscription
    });
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      meals,
      setMeals,
      orders,
      setOrders,
      notifications,
      setNotifications,
      deliveryStaff,
      setDeliveryStaff,
      addNotification,
      addMeal,
      updateMeal,
      placeOrder,
      login,
      register,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Authentication Component
const AuthPage: React.FC = () => {
  const { login, register, setCurrentUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(formData.email, formData.password, isAdmin);
      if (!success) {
        setError(isAdmin ? 'Invalid admin credentials' : 'Invalid email or password');
      }
    } else {
      if (!formData.name) {
        setError('Name is required');
        return;
      }
      const success = register(formData.name, formData.email, formData.password, isAdmin);
      if (!success) {
        setError(isAdmin ? 'Admin registration not allowed' : 'Email already exists');
      }
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setCurrentUser({
        id: 'customer1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        preferences: {
          dietary: ['veg'],
          spiceLevel: 2,
          allergies: ['nuts'],
          calorieTarget: 2000
        },
        subscription: {
          plan: 'weekly',
          status: 'active',
          nextRenewal: '2023-11-15'
        }
      });
    } else {
      setCurrentUser({
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@nourishnet.com',
        role: 'admin'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 mb-2">NourishNet</h1>
        <p className="text-lg text-gray-600">Healthy meals delivered to your doorstep</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsAdmin(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAdmin ? 'bg-green-600 text-white' : 'text-gray-600'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isAdmin ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? 'Sign In' : 'Sign Up'} as {isAdmin ? 'Admin' : 'Customer'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && !isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border rounded-md px-3 py-2"
              placeholder={isAdmin ? "Enter admin username" : "Enter your email"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full border rounded-md px-3 py-2"
              placeholder={isAdmin ? "Enter admin password" : "Enter your password"}
              required
            />
          </div>

          {isAdmin && isLogin && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-sm">
              Admin credentials: username: admin123, password: welcome123
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-center text-gray-500 text-sm mb-2">Quick demo access:</p>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm"
            >
              Demo Customer
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Portal Components
const CustomerPortal: React.FC = () => {
  const { currentUser, meals, orders, notifications, placeOrder, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState<{ mealId: string; quantity: number; customization?: string }[]>([]);
  const [customizationModal, setCustomizationModal] = useState<{ meal: Meal; isOpen: boolean }>({ meal: meals[0], isOpen: false });
  const [customizationOptions, setCustomizationOptions] = useState({
    spiceLevel: 2,
    notes: ''
  });

  const addToCart = (meal: Meal) => {
    setCustomizationModal({ meal, isOpen: true });
  };

  const confirmCustomization = () => {
    const existingItemIndex = cart.findIndex(item => item.mealId === customizationModal.meal.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
        customization: `Spice level: ${customizationOptions.spiceLevel}. Notes: ${customizationOptions.notes}`
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        mealId: customizationModal.meal.id,
        quantity: 1,
        customization: `Spice level: ${customizationOptions.spiceLevel}. Notes: ${customizationOptions.notes}`
      }]);
    }
    
    setCustomizationModal({ meal: meals[0], isOpen: false });
    setCustomizationOptions({ spiceLevel: 2, notes: '' });
  };

  const removeFromCart = (mealId: string) => {
    setCart(cart.filter(item => item.mealId !== mealId));
  };

  const checkout = () => {
    if (!currentUser || cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => {
      const meal = meals.find(m => m.id === item.mealId);
      return sum + (meal ? meal.price * item.quantity : 0);
    }, 0);
    
    placeOrder({
      userId: currentUser.id,
      meals: cart,
      total,
      deliveryAddress: '123 Main St, Apt 4B', // In a real app, this would come from user profile
      deliveryTime: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
    });
    
    setCart([]);
  };

  const userOrders = orders.filter(order => order.userId === currentUser?.id);
  const userNotifications = notifications.filter(n => 
    n.userId === currentUser?.id || n.userId === 'all'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-green-700">NourishNet</h1>
            <span className="ml-4 text-sm text-gray-500">Customer Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {userNotifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {userNotifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setCurrentUser(null);
                // Clear any additional auth state if needed
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['menu', 'orders', 'subscription', 'notifications'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filter by:</span>
                <select className="border rounded-md px-3 py-1 text-sm">
                  <option>All Categories</option>
                  <option>Main Course</option>
                  <option>Appetizer</option>
                  <option>Dessert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.filter(meal => meal.isAvailable).map(meal => (
                <div key={meal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={`https://placeholder-image-service.onrender.com/image/300x200?prompt=food%20${encodeURIComponent(meal.name)}&id=${meal.id}`} 
                    alt={`Delicious ${meal.name} served on a plate`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                      {meal.isSpecial && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                          Festive Special
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-green-600 font-semibold">${meal.price.toFixed(2)}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{meal.calories} cal</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-500 text-sm capitalize">{meal.dietary}</span>
                    </div>
                    <div className="flex mt-3">
                      {[1, 2, 3].map(level => (
                        <span
                          key={level}
                          className={`w-3 h-3 rounded-full mx-0.5 ${level <= meal.spiceLevel 
                            ? 'bg-red-500' 
                            : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => addToCart(meal)}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
            
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id.slice(-6)}</h3>
                        <p className="text-gray-600 text-sm">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {order.meals.map(item => {
                          const meal = meals.find(m => m.id === item.mealId);
                          return meal ? (
                            <li key={item.mealId} className="flex justify-between">
                              <span>{meal.name} × {item.quantity}</span>
                              <span>${(meal.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Estimated delivery:</p>
                        <p className="font-medium">
                          {new Date(order.deliveryTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total:</p>
                        <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {order.status === 'out-for-delivery' && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium">
                          Your food is on the way! Track delivery in real-time.
                        </p>
                        <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 w-3/4"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && currentUser?.subscription && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Subscription</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold capitalize">
                    {currentUser.subscription.plan} Plan
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Status: <span className="capitalize font-medium">{currentUser.subscription.status}</span>
                  </p>
                  <p className="text-gray-600 mt-1">
                    Next renewal: {new Date(currentUser.subscription.nextRenewal).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
                    Change Plan
                  </button>
                  <button className="bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-md text-sm font-medium">
                    {currentUser.subscription.status === 'active' ? 'Pause' : 'Resume'} Subscription
                  </button>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h4 className="font-medium mb-4">Your Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Dietary Preferences</p>
                    <p className="font-medium">{currentUser.preferences?.dietary.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spice Level</p>
                    <p className="font-medium">{currentUser.preferences?.spiceLevel}/3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Allergies</p>
                    <p className="font-medium">{currentUser.preferences?.allergies.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Calorie Target</p>
                    <p className="font-medium">{currentUser.preferences?.calorieTarget} cal/day</p>
                  </div>
                </div>
                
                <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium">
                  Update Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
            
            {userNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">You don't have any notifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userNotifications.map(notification => (
                  <div key={notification.id} className={`bg-white rounded-lg shadow-md p-4 ${notification.isRead ? 'opacity-75' : 'border-l-4 border-blue-500'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-end">
                      {!notification.isRead && (
                        <button className="text-blue-600 text-sm font-medium">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={() => setCart([])} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto h-[calc(100%-10rem)]">
            {cart.map(item => {
              const meal = meals.find(m => m.id === item.mealId);
              return meal ? (
                <div key={`${item.mealId}-${item.customization}`} className="flex justify-between items-start py-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium">{meal.name} × {item.quantity}</p>
                    {item.customization && (
                      <p className="text-sm text-gray-600 mt-1">{item.customization}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="font-semibold">${(meal.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.mealId)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">
                ${cart.reduce((sum, item) => {
                  const meal = meals.find(m => m.id === item.mealId);
                  return sum + (meal ? meal.price * item.quantity : 0);
                }, 0).toFixed(2)}
              </span>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {customizationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Customize {customizationModal.meal.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map(level => (
                    <button
                      key={level}
                      onClick={() => setCustomizationOptions({...customizationOptions, spiceLevel: level})}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        customizationOptions.spiceLevel === level 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  value={customizationOptions.notes}
                  onChange={e => setCustomizationOptions({...customizationOptions, notes: e.target.value})}
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  placeholder="Any allergies or special requests?"
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3 justify-end">
              <button
                onClick={() => setCustomizationModal({ meal: meals[0], isOpen: false })}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmCustomization}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin Dashboard Components
const AdminDashboard: React.FC = () => {
  const { currentUser, meals, orders, notifications, deliveryStaff, addMeal, updateMeal, addNotification, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'main-course',
    dietary: 'veg',
    spiceLevel: 2,
    calories: 0,
    ingredients: [],
    isSpecial: false,
    isAvailable: true
  });
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'promotional' as 'order' | 'system' | 'promotional',
    userId: 'all'
  });

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.description && newMeal.price > 0) {
      addMeal(newMeal);
      setNewMeal({
        name: '',
        description: '',
        price: 0,
        category: 'main-course',
        dietary: 'veg',
        spiceLevel: 2,
        calories: 0,
        ingredients: [],
        isSpecial: false,
        isAvailable: true
      });
    }
  };

  const handleSendNotification = () => {
    if (notificationForm.title && notificationForm.message) {
      addNotification(notificationForm);
      setNotificationForm({
        title: '',
        message: '',
        type: 'promotional',
        userId: 'all'
      });
    }
  };

  const toggleMealAvailability = (mealId: string, isAvailable: boolean) => {
    updateMeal(mealId, { isAvailable });
  };

  // Analytics data (simulated)
  const analyticsData = {
    revenue: 12540,
    orders: 342,
    customers: 178,
    retention: 87.5,
    topMeals: meals.slice(0, 3)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-blue-700">NourishNet Admin</h1>
            <span className="ml-4 text-sm text-gray-500">Dashboard</span>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {['dashboard', 'menu', 'orders', 'customers', 'staff', 'notifications', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-semibold">${analyticsData.revenue}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-semibold">{analyticsData.orders}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Customers</p>
                    <p className="text-2xl font-semibold">{analyticsData.customers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Retention Rate</p>
                    <p className="text-2xl font-semibold">{analyticsData.retention}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Management</h2>
            
            {/* Add New Meal Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Add New Meal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter meal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newMeal.price}
                    onChange={e => setNewMeal({...newMeal, price: parseFloat(e.target.value)})}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newMeal.category}
                    onChange={e => setNewMeal({...newMeal, category: e.target.value})}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="main-course">Main Course</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Type</label>
                  <select
                    value={newMeal.dietary}
                    onChange={e => setNewMeal({...newMeal, dietary: e.target.value as 'veg' | 'non-veg'})}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newMeal.description}
                  onChange={e => setNewMeal({...newMeal, description: e.target.value})}
                  className="w-full border rounded-md px-3 py-2"
                  rows={2}
                  placeholder="Describe the meal"
                />
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newMeal.isSpecial}
                    onChange={e => setNewMeal({...newMeal, isSpecial: e.target.checked})}
                    className="rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Festive Special</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newMeal.isAvailable}
                    onChange={e => setNewMeal({...newMeal, isAvailable: e.target.checked})}
                    className="rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available</span>
                </label>
              </div>
              
              <button
                onClick={handleAddMeal}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
              >
                Add Meal
              </button>
            </div>
            
            {/* Meal List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h3 className="text-lg font-semibold p-6 border-b">Current Menu</h3>
              <div className="divide-y">
                {meals.map(meal => (
                  <div key={meal.id} className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-semibold">{meal.name}</h4>
                        {meal.isSpecial && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                            Special
                          </span>
                        )}
                        {!meal.isAvailable && (
                          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
                      <p className="text-green-600 font-semibold mt-1">${meal.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleMealAvailability(meal.id, !meal.isAvailable)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          meal.isAvailable 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {meal.isAvailable ? 'Make Unavailable' : 'Make Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">All Orders</h3>
              </div>
              
              <div className="divide-y">
                {orders.map(order => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Order #{order.id.slice(-6)}</h4>
                        <p className="text-sm text-gray-600">Customer ID: {order.userId}</p>
                        <p className="text-sm text-gray-600">
                          Placed: {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Order Items</h5>
                        <ul className="space-y-1">
                          {order.meals.map(item => {
                            const meal = meals.find(m => m.id === item.mealId);
                            return meal ? (
                              <li key={item.mealId} className="text-sm">
                                {meal.name} × {item.quantity} - ${(meal.price * item.quantity).toFixed(2)}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Delivery Details</h5>
                        <p className="text-sm">Address: {order.deliveryAddress}</p>
                        <p className="text-sm">
                          Scheduled: {new Date(order.deliveryTime).toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold mt-2">Total: ${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {order.status !== 'delivered' && (
                      <div className="mt-4 flex space-x-2">
                        <button className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-md hover:bg-blue-200">
                          Update Status
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications Management</h2>
            
            {/* Send Notification Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Send New Notification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={e => setNotificationForm({...notificationForm, title: e.target.value})}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={notificationForm.type}
                    onChange={e => setNotificationForm({...notificationForm, type: e.target.value as any})}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="promotional">Promotional</option>
                    <option value="order">Order Update</option>
                    <option value="system">System Alert</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={notificationForm.message}
                  onChange={e => setNotificationForm({...notificationForm, message: e.target.value})}
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Notification message"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <select
                  value={notificationForm.userId}
                  onChange={e => setNotificationForm({...notificationForm, userId: e.target.value})}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="all">All Customers</option>
                  <option value="customer1">John Doe</option>
                  <option value="specific">Specific Customer</option>
                </select>
              </div>
              
              <button
                onClick={handleSendNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
              >
                Send Notification
              </button>
            </div>
            
            {/* Notification History */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h3 className="text-lg font-semibold p-6 border-b">Notification History</h3>
              
              <div className="divide-y">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notification.type === 'order' ? 'bg-blue-100 text-blue-800' :
                        notification.type === 'promotional' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>To: {notification.userId === 'all' ? 'All Customers' : 'User ' + notification.userId}</span>
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Top Selling Meals</h3>
                <div className="space-y-3">
                  {analyticsData.topMeals.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center">
                      <span className="text-sm">{meal.name}</span>
                      <span className="text-sm font-semibold">${meal.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
                <div className="space-y-2">
                  {['confirmed', 'preparing', 'out-for-delivery', 'delivered'].map(status => {
                    const count = orders.filter(o => o.status === status).length;
                    const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : 0;
                    return (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{status.replace(/-/g, ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{count}</span>
                          <span className="text-sm text-gray-600">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {notifications.slice(0, 5).map(notification => (
                  <div key={notification.id} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      notification.type === 'order' ? 'bg-blue-500' :
                      notification.type === 'promotional' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { currentUser } = useApp();
  
  return (
    <>
      {!currentUser && <AuthPage />}
      {currentUser?.role === 'customer' && <CustomerPortal />}
      {currentUser?.role === 'admin' && <AdminDashboard />}
    </>
  );
};

// Wrap App with Provider
const AppWithProvider: React.FC = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWithProvider;
