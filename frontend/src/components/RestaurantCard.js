import React from 'react';

function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={() => onClick(restaurant)}
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
  );
}

export default RestaurantCard;