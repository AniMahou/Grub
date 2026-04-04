import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RestaurantCard from './RestaurantCard';
import SearchBar from './SearchBar';

function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    place: 'all',
    cuisine: 'all',
    deliveryType: 'all',
    offer: 'all'
  });

  useEffect(() => {
    loadRestaurants();
  }, [searchTerm, filters]);

  const loadRestaurants = async () => {
    setLoading(true);
    const params = { ...filters };
    if (searchTerm) params.search = searchTerm;
    
    const data = await api.getRestaurants(params);
    setRestaurants(data.restaurants || []);
    setLoading(false);
  };

  const places = ['all', 'Dhanmondi', 'Gulshan', 'Mohammadpur', 'Mirpur', 'Uttara'];
  const cuisines = ['all', 'Italian', 'Japanese', 'Indian', 'Chinese', 'Mexican', 'Deshi'];
  const deliveryTypes = ['all', 'delivery', 'pickup', 'dinein'];

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search restaurants by name, place, or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <select
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters({...filters, place: e.target.value})}
          value={filters.place}
        >
          {places.map(place => (
            <option key={place} value={place}>
              {place === 'all' ? '📍 All Places' : place}
            </option>
          ))}
        </select>
        
        <select
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
          value={filters.cuisine}
        >
          {cuisines.map(cuisine => (
            <option key={cuisine} value={cuisine}>
              {cuisine === 'all' ? '🍽️ All Cuisines' : cuisine}
            </option>
          ))}
        </select>
        
        <select
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters({...filters, deliveryType: e.target.value})}
          value={filters.deliveryType}
        >
          {deliveryTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? '🚚 All Types' : `🚗 ${type}`}
            </option>
          ))}
        </select>
        
        <select
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters({...filters, offer: e.target.value})}
          value={filters.offer}
        >
          <option value="all">🏷️ All Offers</option>
          <option value="yes">✨ Has Offer</option>
          <option value="no">❌ No Offer</option>
        </select>
      </div>
      
      {/* Results Count */}
      <p className="text-gray-600 mb-4">Found {restaurants.length} restaurants</p>
      
      {/* Restaurant Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No restaurants found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <div
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              className="card cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-800">{restaurant.name}</h3>
                {restaurant.hasOffer === 'yes' && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    🎉 Offer
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-2">📍 {restaurant.place}</p>
              <p className="text-gray-500 text-sm mb-2">🍽️ {restaurant.cuisines}</p>
              <p className="text-gray-500 text-sm mb-2">🚚 {restaurant.deliveryTypes}</p>
              <p className="text-blue-600 font-semibold">
                ৳{restaurant.minPrice} - ৳{restaurant.maxPrice}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantList;