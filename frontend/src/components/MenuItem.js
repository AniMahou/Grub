import React from 'react';

function MenuItem({ item, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
          <p className="text-gray-500 text-sm">{item.cuisine}</p>
          {item.available === 'yes' ? (
            <p className="text-green-600 font-bold text-xl mt-2">৳{item.price}</p>
          ) : (
            <p className="text-red-500 text-sm mt-2">Currently Unavailable</p>
          )}
        </div>
        {item.available === 'yes' && (
          <button
            onClick={() => onAddToCart(item)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default MenuItem;