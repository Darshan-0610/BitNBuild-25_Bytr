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
        // Corrected template literal
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
      // Corrected template literal
      message: `Your order #${newOrder.id} has been placed successfully.`,
      type: 'order',
      isRead: false
    });
  };

  const login = (email: string, password: string, isAdmin: boolean = false): boolean => {
    if (isAdmin) {
      // Adjusted admin email for clarity
      if (email === 'admin@nourishnet.com' && password === 'welcome123') {
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

// --- AUTH PAGE (Modern Login/Register) ---
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-green-700 tracking-tight">NourishNet</h1>
        <p className="text-xl text-gray-600 mt-2">Eat Well, Live Better.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition duration-500 hover:shadow-green-300/50">
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setIsAdmin(false)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                !isAdmin ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isAdmin ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? 'Welcome Back' : 'Join NourishNet'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && !isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder={isAdmin ? "admin@nourishnet.com" : "Enter your email"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder={isAdmin ? "Admin Password" : "Enter your password"}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full ${isAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-opacity-30 transition-all duration-300 transform hover:scale-[1.01]`}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-600 hover:text-green-700 text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-center text-gray-500 text-sm mb-3">Quick Demo Access (No Password Needed)</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium transition-colors"
            >
              Demo Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CUSTOMER PORTAL (UX Refinements for Menu/Cart) ---
const CustomerPortal: React.FC = () => {
  const { currentUser, meals, orders, notifications, placeOrder, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState<{ mealId: string; quantity: number; customization?: string }[]>([]);
  const [customizationModal, setCustomizationModal] = useState<{ meal: Meal; isOpen: boolean }>({ meal: meals[0], isOpen: false });
  const [customizationOptions, setCustomizationOptions] = useState({
    spiceLevel: 2,
    notes: ''
  });
  
  // State for mobile cart visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (meal: Meal) => {
    // Reset options to meal's default spice level
    setCustomizationOptions({ spiceLevel: meal.spiceLevel || 2, notes: '' });
    setCustomizationModal({ meal, isOpen: true });
  };

  const confirmCustomization = () => {
    const meal = customizationModal.meal;
    
    // Create a unique key for items with customization to allow multiple unique entries of the same meal
    const customizationString = `Spice:${customizationOptions.spiceLevel}|Notes:${customizationOptions.notes.trim()}`;
    const cartItem = {
      mealId: meal.id,
      quantity: 1,
      customization: customizationString
    };
    
    setCart(prevCart => {
      // Find if an identical item (same mealId AND same customization) already exists
      const existingItemIndex = prevCart.findIndex(item => 
        item.mealId === meal.id && item.customization === customizationString
      );

      if (existingItemIndex >= 0) {
        // If found, increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // If not found, add new item
        return [...prevCart, cartItem];
      }
    });

    setCustomizationModal({ meal: meals[0], isOpen: false });
    setCustomizationOptions({ spiceLevel: 2, notes: '' });
    setIsCartOpen(true); // Open cart after adding item
  };

  const updateCartQuantity = (mealId: string, customization: string | undefined, delta: number) => {
    setCart(prevCart => {
        const updatedCart = prevCart.map(item => {
            if (item.mealId === mealId && item.customization === customization) {
                return { ...item, quantity: item.quantity + delta };
            }
            return item;
        }).filter(item => item.quantity > 0); // Remove if quantity drops to 0 or below
        return updatedCart;
    });
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
    setIsCartOpen(false);
    // Note: A real app would show a confirmation modal here instead of just closing the cart.
  };

  const userOrders = orders.filter(order => order.userId === currentUser?.id);
  const userNotifications = notifications.filter(n => 
    n.userId === currentUser?.id || n.userId === 'all'
  );
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Helper for Spice Icon rendering
  const getSpiceIcon = (level: number) => {
    switch (level) {
      case 1: return <span className="text-sm text-green-500">🌶️ Mild</span>;
      case 2: return <span className="text-sm text-yellow-600">🌶️🌶️ Medium</span>;
      case 3: return <span className="text-sm text-red-600">🌶️🌶️🌶️ Spicy</span>;
      default: return null;
    }
  };

  // Helper for dietary tag color
  const getDietaryTag = (dietary: 'veg' | 'non-veg') => {
    return dietary === 'veg' 
      ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">🌱 Veg</span>
      : <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">🥩 Non-Veg</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-700">NourishNet</h1>
            <span className="ml-4 hidden sm:inline text-sm text-gray-500">Customer Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Cart Button (Mobile) */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="md:hidden relative p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Notifications Button */}
            <button onClick={() => setActiveTab('notifications')} className="relative p-2 text-gray-600">
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
              onClick={() => setCurrentUser(null)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Navigation - Moved inside header for a cleaner look */}
        <nav className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 sm:space-x-8 overflow-x-auto whitespace-nowrap">
              {['menu', 'orders', 'subscription', 'notifications'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab 
                    ? 'border-green-500 text-green-700' 
                    : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>


      {/* Main Content (Responsive Margin added for desktop cart) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:mr-80">
        
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Today's Selection</h2>
            
            {/* Filters/Sorting - Simple implementation */}
            <div className="flex justify-start items-center space-x-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-base font-semibold text-gray-700 mr-2">Filters:</h3>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500">
                  <option>All Meals</option>
                  <option>High Protein</option>
                  <option>Low Carb</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500">
                  <option>Sort: Popularity</option>
                  <option>Sort: Price Low-High</option>
                  <option>Sort: Price High-Low</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.filter(meal => meal.isAvailable).map(meal => (
                <div 
                  key={meal.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100"
                >
                  <div className="relative">
                    <img 
                      src={`https://placeholder-image-service.onrender.com/image/400x250?prompt=healthy%20meal%20${encodeURIComponent(meal.name)}&id=${meal.id}`} 
                      alt={`Delicious ${meal.name} served on a plate`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {meal.isSpecial && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          SPECIAL
                        </span>
                      )}
                      {getDietaryTag(meal.dietary)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{meal.name}</h3>
                      <span className="text-2xl font-extrabold text-green-600">${meal.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm h-10 overflow-hidden">{meal.description}</p>
                    
                    <div className="flex items-center justify-between mt-3 text-sm border-t pt-3">
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-500 font-medium">{meal.calories} cal</span>
                            <span className="text-gray-400">•</span>
                            {getSpiceIcon(meal.spiceLevel)}
                        </div>
                        <button
                          onClick={() => addToCart(meal)}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Order History</h2>
            
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-10 text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Your order history is empty. Time to nourish!</p>
                <button 
                    onClick={() => setActiveTab('menu')}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-semibold transition-colors"
                >
                    View Menu
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id.slice(-6)}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-4 border-t border-dashed pt-4">
                      <h4 className="font-semibold mb-2 text-gray-700">Items Ordered:</h4>
                      <ul className="space-y-2 text-sm">
                        {order.meals.map(item => {
                          const meal = meals.find(m => m.id === item.mealId);
                          return meal ? (
                            <li key={`${item.mealId}-${item.customization}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium text-gray-800">{meal.name} × {item.quantity}</span>
                              <span className="text-green-600 font-semibold">${(meal.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Delivery Est.:</p>
                        <p className="font-bold text-gray-800">
                          {new Date(order.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-gray-500">Total:</p>
                        <p className="text-2xl font-bold text-green-700">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {order.status === 'out-for-delivery' && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-xl">
                        <p className="text-blue-800 text-sm font-semibold mb-2">
                          Driver: Raj Sharma (Est. 5 min away)
                        </p>
                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                          {/* Simulated Progress */}
                          <div className="h-full bg-blue-600 w-4/5 transition-all duration-1000"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab (Simplified for brevity, visual design updated) */}
        {activeTab === 'subscription' && currentUser?.subscription && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Your Meal Plan</h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div className="flex items-center">
                    <span className="text-4xl mr-4 text-green-600">📦</span>
                    <div>
                      <h3 className="text-2xl font-bold capitalize">
                        {currentUser.subscription.plan} Plan
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Next Renewal: <span className="font-medium">{new Date(currentUser.subscription.nextRenewal).toLocaleDateString()}</span>
                      </p>
                    </div>
                </div>
                
                <div className="text-right">
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${
                      currentUser.subscription.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                        {currentUser.subscription.status}
                    </span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4 text-gray-700">My Dietary Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Dietary" value={currentUser.preferences?.dietary.join(', ') || 'None'} icon="🍽️" />
                  <StatCard title="Spice Level" value={`${currentUser.preferences?.spiceLevel}/3`} icon="🔥" />
                  <StatCard title="Calorie Target" value={`${currentUser.preferences?.calorieTarget} cal/day`} icon="⚡" />
                  <StatCard title="Allergies" value={currentUser.preferences?.allergies.join(', ') || 'None'} icon="⚠️" />
                </div>
                
                <button className="mt-8 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-bold shadow-md transition-colors transform hover:scale-[1.01]">
                  Update Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Notifications</h2>
            
            {userNotifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                <p className="text-gray-500 text-lg">No new notifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userNotifications.map(notification => (
                  <div key={notification.id} className={`bg-white rounded-xl shadow-md p-5 transition-all duration-200 flex items-start space-x-4 ${notification.isRead ? 'opacity-80 border border-gray-100' : 'border-l-4 border-blue-500 shadow-lg'}`}>
                    <span className={`text-xl ${notification.type === 'order' ? 'text-blue-500' : notification.type === 'promotional' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {notification.type === 'order' ? '🔔' : notification.type === 'promotional' ? '✨' : '⚙️'}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{notification.title}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">{notification.message}</p>
                    </div>
                    <div className="ml-4 pt-1">
                      {!notification.isRead && (
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                          Read
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

      {/* Cart Sidebar (Visible on desktop, toggleable on mobile) */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} md:block md:static md:w-80 md:ml-auto md:h-auto md:shadow-none`}>
        <div className="p-5 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43c.158.627.368 1.228.636 1.786A2.002 2.002 0 1012 15h2a2 2 0 100-4h-2.597l-.845-3.379a1.002 1.002 0 00-.288-.41L7.433 3H16a1 1 0 100-2H3zM10 18a1 1 0 110-2 1 1 0 010 2zm10-2a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                Your Order ({cartItemCount})
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700 md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-5 overflow-y-auto h-[calc(100%-12rem)] md:h-[calc(100vh-12rem)]">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 pt-10">
                <p>Your cart is empty.</p>
                <p className="text-sm mt-1">Start adding some healthy meals!</p>
            </div>
          ) : (
            cart.map(item => {
              const meal = meals.find(m => m.id === item.mealId);
              if (!meal) return null;

              const totalItemPrice = (meal.price * item.quantity).toFixed(2);
              
              // Extract customization details
              const customizationDetails = item.customization?.split('|').map(c => c.split(':')).reduce((acc, [key, value]) => {
                  acc[key] = value;
                  return acc;
              }, {} as Record<string, string>) || {};

              return (
                <div key={`${item.mealId}-${item.customization}`} className="flex flex-col py-4 border-b">
                  <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <p className="font-semibold text-gray-800">{meal.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {customizationDetails.Spice ? getSpiceIcon(parseInt(customizationDetails.Spice)) : ''}
                        </p>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-green-600">${totalItemPrice}</p>
                          <button 
                            onClick={() => updateCartQuantity(item.mealId, item.customization, -item.quantity)}
                            className="text-red-500 hover:text-red-700 text-xs mt-1 transition-colors"
                          >
                            Remove
                          </button>
                      </div>
                  </div>
                  
                  {/* Quantity Control */}
                  <div className="flex items-center justify-between mt-3 bg-gray-100 p-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateCartQuantity(item.mealId, item.customization, -1)}
                        className="w-6 h-6 bg-white border rounded-full text-gray-600 hover:bg-gray-200 transition"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-800 w-5 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.mealId, item.customization, 1)}
                        className="w-6 h-6 bg-white border rounded-full text-gray-600 hover:bg-gray-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-5 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-gray-800">Subtotal:</span>
            <span className="text-2xl font-extrabold text-green-700">
              ${cart.reduce((sum, item) => {
                const meal = meals.find(m => m.id === item.mealId);
                return sum + (meal ? meal.price * item.quantity : 0);
              }, 0).toFixed(2)}
            </span>
          </div>
          <button
            onClick={checkout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 disabled:bg-green-300 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition-colors shadow-lg shadow-green-400/50"
          >
            Checkout ({cartItemCount} Items)
          </button>
        </div>
      </div>

      {/* Customization Modal */}
      {customizationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform scale-100 transition duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Customize {customizationModal.meal.name}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                  {[1, 2, 3].map(level => (
                    <button
                      key={level}
                      onClick={() => setCustomizationOptions({...customizationOptions, spiceLevel: level})}
                      className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-200 border-2 ${
                        customizationOptions.spiceLevel === level 
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-md' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                        <span className="text-2xl">{level === 1 ? '🌶️' : level === 2 ? '🌶️🌶️' : '🌶️🌶️🌶️'}</span>
                        <span className="text-xs font-semibold mt-1">{level === 1 ? 'Mild' : level === 2 ? 'Medium' : 'Spicy'}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions / Allergies</label>
                <textarea
                  value={customizationOptions.notes}
                  onChange={e => setCustomizationOptions({...customizationOptions, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  placeholder="e.g., 'Please omit nuts due to allergy', 'Extra coriander'"
                />
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4 justify-end">
              <button
                onClick={() => setCustomizationModal({ meal: meals[0], isOpen: false })}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCustomization}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-400/50"
              >
                Add 1 to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple reusable stat card component for customer/admin view
const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <div className="flex items-center space-x-3">
            <span className="text-2xl">{icon}</span>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-2 truncate">{value}</p>
    </div>
);


// --- ADMIN DASHBOARD (Professional & Data-focused UI) ---
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
    orders: orders.length,
    customers: 178, // Hardcoded simulation
    retention: 87.5, // Hardcoded simulation
    topMeals: meals.slice(0, 3)
  };

  const ordersToProcess = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-700">NourishNet Admin</h1>
            <span className="ml-4 hidden sm:inline text-sm text-gray-500">Management Dashboard</span>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
        {/* Navigation */}
        <nav className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 sm:space-x-8 overflow-x-auto whitespace-nowrap">
              {['dashboard', 'menu', 'orders', 'notifications', 'staff', 'analytics'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab 
                    ? 'border-blue-500 text-blue-700' 
                    : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Operational Overview</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCardAdmin title="Total Revenue" value={`$${analyticsData.revenue.toLocaleString()}`} color="blue" icon="💰" />
              <StatCardAdmin title="Total Orders" value={analyticsData.orders} color="green" icon="🛒" />
              <StatCardAdmin title="Orders Pending" value={ordersToProcess.length} color="yellow" icon="⏳" />
              <StatCardAdmin title="Active Customers" value={analyticsData.customers} color="purple" icon="🧑‍🤝‍🧑" />
            </div>

            {/* Quick Action & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Panel */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex justify-between items-center">
                        New Orders ({ordersToProcess.length})
                        <button className="text-sm text-blue-500 hover:text-blue-700 font-medium">View All</button>
                    </h3>
                    <div className="space-y-3 h-96 overflow-y-auto">
                        {ordersToProcess.length === 0 ? (
                            <p className="text-gray-500 text-center pt-8">No new orders requiring action.</p>
                        ) : (
                            ordersToProcess.map(order => (
                                <div key={order.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border-l-4 border-yellow-500">
                                    <div>
                                        <p className="font-semibold text-sm">Order #{order.id.slice(-6)} - ${order.total.toFixed(2)}</p>
                                        <p className="text-xs text-gray-600">Status: {order.status.replace(/-/g, ' ')}</p>
                                    </div>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        Process
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Staff Status Panel */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Staff Status</h3>
                    <div className="space-y-4">
                        {deliveryStaff.map(staff => (
                            <div key={staff.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{staff.name}</p>
                                    <p className="text-xs text-gray-500">{staff.vehicle}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                    staff.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {staff.isAvailable ? 'Available' : 'Busy'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 w-full bg-blue-100 text-blue-600 hover:bg-blue-200 py-2 rounded-xl text-sm font-semibold">
                        Manage Staff
                    </button>
                </div>
            </div>
          </div>
        )}
        
        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Menu Management</h2>
            
            {/* Add New Meal Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">Add New Meal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter meal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newMeal.price || ''}
                    onChange={e => setNewMeal({...newMeal, price: parseFloat(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    value={newMeal.calories || ''}
                    onChange={e => setNewMeal({...newMeal, calories: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newMeal.category}
                    onChange={e => setNewMeal({...newMeal, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level (1-3)</label>
                    <input
                        type="number"
                        min="1"
                        max="3"
                        value={newMeal.spiceLevel}
                        onChange={e => setNewMeal({...newMeal, spiceLevel: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newMeal.description}
                  onChange={e => setNewMeal({...newMeal, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={2}
                  placeholder="Describe the meal"
                />
              </div>
              
              <div className="flex items-center space-x-6">
                <label className="flex items-center text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={newMeal.isSpecial}
                    onChange={e => setNewMeal({...newMeal, isSpecial: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Festive Special</span>
                </label>
                <label className="flex items-center text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={newMeal.isAvailable}
                    onChange={e => setNewMeal({...newMeal, isAvailable: e.target.checked})}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm">Available for Order</span>
                </label>
                <button
                    onClick={handleAddMeal}
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg"
                >
                    Publish Meal
                </button>
              </div>
            </div>
            
            {/* Meal List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <h3 className="text-2xl font-bold p-6 border-b text-gray-800">Current Menu ({meals.length})</h3>
              <div className="divide-y divide-gray-100">
                {meals.map(meal => (
                  <div key={meal.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-lg truncate">{meal.name}</h4>
                        {meal.isSpecial && (
                          <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            Special
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meal.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {meal.isAvailable ? 'Available' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 truncate">{meal.description}</p>
                      <p className="text-green-600 font-bold mt-1">${meal.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                      <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">Edit</button>
                      <button
                        onClick={() => toggleMealAvailability(meal.id, !meal.isAvailable)}
                        className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                          meal.isAvailable 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {meal.isAvailable ? 'Set Hidden' : 'Set Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* The remaining Admin tabs (Orders, Notifications, Analytics) also need a visual refresh to match the new style, but the structural logic remains the same. */}

        {/* Orders Tab (Visual Update) */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Orders Management</h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-800">All Orders ({orders.length})</h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <di
