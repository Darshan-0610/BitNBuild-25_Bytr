import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import { useAuthState } from '../../hooks/useAuth';
import { MapPin, Clock, CheckCircle, Truck } from 'lucide-react';

const DeliveryTracking = () => {
  const { userRole } = useAuthState();

  const [currentOrder] = useState({
    id: 'ORD-2024-001',
    status: 'preparing', // preparing, ready, out_for_delivery, delivered
    estimatedDelivery: '12:45 PM',
    items: ['Dal Rice Combo x2'],
    total: 240,
    deliveryAddress: '123 Main Street, Bandra West, Mumbai',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210'
  });

  const trackingSteps = [
    { status: 'confirmed', label: 'Order Confirmed', time: '11:30 AM', completed: true },
    { status: 'preparing', label: 'Preparing Food', time: '11:45 AM', completed: true },
    { status: 'ready', label: 'Ready for Pickup', time: '12:30 PM', completed: false },
    { status: 'out_for_delivery', label: 'Out for Delivery', time: '12:35 PM', completed: false },
    { status: 'delivered', label: 'Delivered', time: '12:45 PM', completed: false }
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Delivery</h1>
            <p className="text-gray-600">Real-time updates on your tiffin delivery</p>
          </div>

          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{currentOrder.id}</h2>
                <p className="text-gray-600">Expected delivery: {currentOrder.estimatedDelivery}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-tiffin-600">₹{currentOrder.total}</p>
                <p className="text-sm text-gray-600">{currentOrder.items.join(', ')}</p>
              </div>
            </div>

            {/* Mock Map Area */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Live tracking map would appear here</p>
                <p className="text-sm text-gray-500">Integration with Google Maps API</p>
              </div>
            </div>

            {/* Tracking Steps */}
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.status} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 text-white' : 
                    step.status === currentOrder.status ? 'bg-tiffin-500 text-white' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : step.status === 'out_for_delivery' ? (
                      <Truck className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.completed || step.status === currentOrder.status ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500">{step.time}</p>
                  </div>
                  {step.status === currentOrder.status && (
                    <span className="bg-tiffin-100 text-tiffin-800 text-xs px-2 py-1 rounded">Current</span>
                  )}
                </div>
              ))}
            </div>

            {/* Driver Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Partner</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{currentOrder.driverName}</p>
                  <p className="text-sm text-gray-600">Phone: {currentOrder.driverPhone}</p>
                </div>
                <button className="btn-secondary text-sm">Call Driver</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryTracking;