import React from 'react';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-500 text-sm">{item.cuisine}</p>
        <p className="text-green-600 font-bold">৳{item.price}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold"
          >
            -
          </button>
          <span className="font-semibold w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full font-bold"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default CartItem;