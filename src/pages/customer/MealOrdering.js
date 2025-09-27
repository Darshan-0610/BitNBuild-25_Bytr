import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import { useAuthState } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingCart, Clock, Star } from 'lucide-react';

const MealOrdering = () => {
  const { userRole } = useAuthState();
  const [selectedMeals, setSelectedMeals] = useState({});
  const [orderType, setOrderType] = useState('today');

  // Mock meal data
  const meals = [
    {
      id: 1,
      name: 'Dal Rice Combo',
      description: 'Traditional dal with basmati rice, pickle, and papad',
      price: 120,
      image: '/api/placeholder/300/200',
      vendor: 'Mumbai Tiffin Co.',
      rating: 4.5,
      prepTime: '20-30 min',
      category: 'North Indian'
    },
    {
      id: 2,
      name: 'South Indian Thali',
      description: 'Rice, sambar, rasam, vegetables, curd, pickle',
      price: 150,
      image: '/api/placeholder/300/200',
      vendor: 'Chennai Express',
      rating: 4.7,
      prepTime: '25-35 min',
      category: 'South Indian'
    },
    {
      id: 3,
      name: 'Punjabi Chole Bhature',
      description: 'Spicy chickpea curry with fluffy bhature bread',
      price: 140,
      image: '/api/placeholder/300/200',
      vendor: 'Punjab Kitchen',
      rating: 4.3,
      prepTime: '15-25 min',
      category: 'Punjabi'
    },
    {
      id: 4,
      name: 'Gujarati Thali',
      description: 'Complete Gujarati meal with rotli, dal, sabzi, rice',
      price: 160,
      image: '/api/placeholder/300/200',
      vendor: 'Gujju Rasoi',
      rating: 4.6,
      prepTime: '20-30 min',
      category: 'Gujarati'
    }
  ];

  const handleQuantityChange = (mealId, change) => {
    setSelectedMeals(prev => {
      const current = prev[mealId] || 0;
      const newQuantity = Math.max(0, current + change);
      
      if (newQuantity === 0) {
        const { [mealId]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [mealId]: newQuantity };
    });
  };

  const handlePlaceOrder = () => {
    const orderItems = Object.entries(selectedMeals).map(([mealId, quantity]) => {
      const meal = meals.find(m => m.id === parseInt(mealId));
      return { meal, quantity };
    });

    if (orderItems.length === 0) {
      toast.error('Please select at least one meal');
      return;
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.meal.price * item.quantity), 0);
    
    // Mock order placement
    toast.success(`Order placed successfully! Total: ₹${totalAmount}`);
    setSelectedMeals({});
  };

  const getTotalAmount = () => {
    return Object.entries(selectedMeals).reduce((sum, [mealId, quantity]) => {
      const meal = meals.find(m => m.id === parseInt(mealId));
      return sum + (meal.price * quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedMeals).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Meals</h1>
            <p className="text-gray-600">Choose your delicious tiffin for today or plan ahead</p>
          </div>

          {/* Order Type Selection */}
          <div className="mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => setOrderType('today')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  orderType === 'today'
                    ? 'bg-tiffin-600 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setOrderType('advance')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  orderType === 'advance'
                    ? 'bg-tiffin-600 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Advance Order
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Meals Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meals.map((meal) => (
                  <div key={meal.id} className="card hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-10 mb-4">
                      <div className="w-full h-40 bg-gradient-to-r from-tiffin-100 to-tiffin-200 rounded-lg flex items-center justify-center">
                        <span className="text-tiffin-600 font-medium">{meal.name}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                          <p className="text-sm text-gray-500">{meal.vendor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-tiffin-600">₹{meal.price}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {meal.rating}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">{meal.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {meal.prepTime}
                        </div>
                        <span className="bg-gray-100 px-2 py-1 rounded">{meal.category}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(meal.id, -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            disabled={!selectedMeals[meal.id]}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {selectedMeals[meal.id] || 0}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(meal.id, 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(meal.id, 1)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {getTotalItems() > 0 && (
              <div className="w-full lg:w-80">
                <div className="card sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    {Object.entries(selectedMeals).map(([mealId, quantity]) => {
                      const meal = meals.find(m => m.id === parseInt(mealId));
                      return (
                        <div key={mealId} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{meal.name}</p>
                            <p className="text-sm text-gray-500">₹{meal.price} × {quantity}</p>
                          </div>
                          <p className="font-medium">₹{meal.price * quantity}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-tiffin-600">₹{getTotalAmount()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{getTotalItems()} items</p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full btn-primary mt-6 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Place Order</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MealOrdering;