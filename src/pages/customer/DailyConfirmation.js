import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import { useAuthState } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { CheckCircle, X, Calendar, Clock, Utensils } from 'lucide-react';

const DailyConfirmation = () => {
  const { userRole } = useAuthState();
  
  // Mock upcoming meals data
  const [upcomingMeals, setUpcomingMeals] = useState([
    {
      id: 1,
      date: '2024-01-28',
      dayName: 'Tomorrow',
      meal: {
        name: 'Chole Bhature',
        description: 'Spicy chickpea curry with fluffy bhature bread',
        vendor: 'Punjab Kitchen',
        price: 140,
        defaultTime: '12:30 PM'
      },
      status: 'pending', // pending, confirmed, skipped
      customTime: null
    },
    {
      id: 2,
      date: '2024-01-29',
      dayName: 'Day After Tomorrow',
      meal: {
        name: 'Rajma Rice',
        description: 'Kidney bean curry with basmati rice',
        vendor: 'Mumbai Tiffin Co.',
        price: 120,
        defaultTime: '12:30 PM'
      },
      status: 'pending',
      customTime: null
    },
    {
      id: 3,
      date: '2024-01-30',
      dayName: 'Wednesday',
      meal: {
        name: 'South Indian Thali',
        description: 'Rice, sambar, rasam, vegetables, curd, pickle',
        vendor: 'Chennai Express',
        price: 150,
        defaultTime: '12:30 PM'
      },
      status: 'confirmed',
      customTime: '1:00 PM'
    }
  ]);

  const handleConfirm = (mealId, customTime = null) => {
    setUpcomingMeals(prev => 
      prev.map(meal => 
        meal.id === mealId 
          ? { ...meal, status: 'confirmed', customTime }
          : meal
      )
    );
    toast.success('Meal confirmed successfully!');
  };

  const handleSkip = (mealId) => {
    setUpcomingMeals(prev => 
      prev.map(meal => 
        meal.id === mealId 
          ? { ...meal, status: 'skipped', customTime: null }
          : meal
      )
    );
    toast.success('Meal skipped');
  };

  const handleTimeChange = (mealId, time) => {
    setUpcomingMeals(prev => 
      prev.map(meal => 
        meal.id === mealId 
          ? { ...meal, customTime: time }
          : meal
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'skipped': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5" />;
      case 'skipped': return <X className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  // Generate time options (30-minute intervals from 11:00 AM to 3:00 PM)
  const timeOptions = [];
  for (let hour = 11; hour <= 15; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const time12 = new Date(`2024-01-01T${time24}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      timeOptions.push({ value: time12, label: time12 });
    }
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Confirmations</h1>
            <p className="text-gray-600">Confirm or skip your upcoming meals</p>
          </div>

          {/* Summary Card */}
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Meals Summary</h2>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>{upcomingMeals.filter(m => m.status === 'confirmed').length} Confirmed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>{upcomingMeals.filter(m => m.status === 'pending').length} Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>{upcomingMeals.filter(m => m.status === 'skipped').length} Skipped</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-tiffin-600">
                  ₹{upcomingMeals
                    .filter(m => m.status === 'confirmed')
                    .reduce((sum, m) => sum + m.meal.price, 0)}
                </p>
                <p className="text-sm text-gray-600">Total confirmed</p>
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-6">
            {upcomingMeals.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-tiffin-100 rounded-lg flex items-center justify-center">
                      <Utensils className="h-6 w-6 text-tiffin-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.meal.name}</h3>
                      <p className="text-sm text-gray-600">{item.meal.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-2 capitalize">{item.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {item.dayName} ({item.date})
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Default delivery: {item.meal.defaultTime}
                      </div>
                      <p className="text-sm text-gray-600">{item.meal.description}</p>
                      <p className="text-lg font-semibold text-tiffin-600">₹{item.meal.price}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Custom Time Selection */}
                    {item.status !== 'skipped' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Time (Optional)
                        </label>
                        <select
                          value={item.customTime || item.meal.defaultTime}
                          onChange={(e) => handleTimeChange(item.id, e.target.value)}
                          className="input-field"
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {item.status !== 'confirmed' && (
                        <button
                          onClick={() => handleConfirm(item.id, item.customTime)}
                          className="flex-1 btn-success flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Confirm</span>
                        </button>
                      )}
                      
                      {item.status !== 'skipped' && (
                        <button
                          onClick={() => handleSkip(item.id)}
                          className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Skip</span>
                        </button>
                      )}

                      {(item.status === 'confirmed' || item.status === 'skipped') && (
                        <button
                          onClick={() => {
                            setUpcomingMeals(prev => 
                              prev.map(meal => 
                                meal.id === item.id 
                                  ? { ...meal, status: 'pending', customTime: null }
                                  : meal
                              )
                            );
                          }}
                          className="flex-1 btn-secondary"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="card mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const pendingMeals = upcomingMeals.filter(m => m.status === 'pending');
                  pendingMeals.forEach(meal => handleConfirm(meal.id));
                }}
                className="btn-success flex items-center space-x-2"
                disabled={upcomingMeals.filter(m => m.status === 'pending').length === 0}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Confirm All Pending</span>
              </button>
              
              <button
                onClick={() => {
                  const pendingMeals = upcomingMeals.filter(m => m.status === 'pending');
                  pendingMeals.forEach(meal => handleSkip(meal.id));
                }}
                className="btn-secondary flex items-center space-x-2"
                disabled={upcomingMeals.filter(m => m.status === 'pending').length === 0}
              >
                <X className="h-4 w-4" />
                <span>Skip All Pending</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyConfirmation;