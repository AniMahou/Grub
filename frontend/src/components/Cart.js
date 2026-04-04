import React from 'react';

function Cart({ cart, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout, onBack }) {
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious items from the menu!</p>
        <button onClick={onBack} className="btn-primary">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h2>
          
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
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
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClearCart}
              className="text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>৳{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>৳50.00</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>৳{(calculateTotal() * 0.05).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>৳{(calculateTotal() + 50 + (calculateTotal() * 0.05)).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Proceed to Checkout
          </button>
          
          <button
            onClick={onBack}
            className="w-full mt-3 text-gray-600 hover:text-gray-800"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;