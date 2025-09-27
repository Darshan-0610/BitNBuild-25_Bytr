import React from 'react';
import Navigation from '../../components/Navigation';
import { useAuthState } from '../../hooks/useAuth';
import { Gift, Star, Clock, Calendar } from 'lucide-react';

const FestiveSpecials = () => {
  const { userRole } = useAuthState();

  // Mock festive meals data
  const festiveSpecials = [
    {
      id: 1,
      name: 'Diwali Special Thali',
      description: 'Traditional sweets, snacks, and complete meal for Diwali celebration',
      price: 299,
      originalPrice: 350,
      vendor: 'Festive Foods Co.',
      rating: 4.8,
      availableUntil: '2024-02-05',
      image: 'diwali-special',
      category: 'Limited Edition'
    },
    {
      id: 2,
      name: 'Valentine Special Combo',
      description: 'Romantic dinner for two with special dessert',
      price: 599,
      originalPrice: 750,
      vendor: 'Romance Kitchen',
      rating: 4.9,
      availableUntil: '2024-02-14',
      image: 'valentine-special',
      category: 'Couples Special'
    }
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation userRole={userRole} />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Festive Specials</h1>
            <p className="text-gray-600">Limited edition meals for special occasions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festiveSpecials.map((special) => (
              <div key={special.id} className="card hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="h-16 w-16 text-purple-600" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">{special.category}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{special.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900">{special.name}</h3>
                  <p className="text-sm text-gray-600">{special.description}</p>
                  <p className="text-sm text-gray-500">{special.vendor}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-tiffin-600">₹{special.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{special.originalPrice}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Until {special.availableUntil}
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary">Order Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FestiveSpecials;