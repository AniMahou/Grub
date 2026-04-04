import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MenuList({ restaurant, onAddToCart, onBack, onViewCart }) {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [cuisine, setCuisine] = useState('all');

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    filterMenu();
  }, [menu, minPrice, maxPrice, cuisine]);

  const loadMenu = async () => {
    setLoading(true);
    const data = await api.getMenu(restaurant.id);
    setMenu(data.menu || []);
    setFilteredMenu(data.menu || []);
    setLoading(false);
  };

  const filterMenu = () => {
    let filtered = [...menu];
    filtered = filtered.filter(item => item.price >= minPrice && item.price <= maxPrice);
    if (cuisine !== 'all') {
      filtered = filtered.filter(item => item.cuisine === cuisine);
    }
    setFilteredMenu(filtered);
  };

  const cuisines = ['all', ...new Set(menu.map(item => item.cuisine))];

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <button onClick={onBack} className="text-blue-500 hover:text-blue-700 mb-2 block">
              ← Back to Restaurants
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.place}</p>
            <p className="text-gray-500 text-sm mt-2">{restaurant.cuisines}</p>
          </div>
          <button
            onClick={onViewCart}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Cart 🛒
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-semibold mb-3">Filter Menu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cuisine</label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {cuisines.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Cuisines' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      ) : filteredMenu.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No menu items found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenu.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.cuisine}</p>
                  <p className="text-green-600 font-bold text-xl mt-2">৳{item.price}</p>
                </div>
                <button
                  onClick={() => onAddToCart(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuList;