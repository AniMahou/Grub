import React from 'react';

function Navbar({ userName, onLogout, cartItemCount, onCartClick, onProfileClick, onHomeClick }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <button 
            onClick={onHomeClick}
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            🍕 FoodieExpress
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button
              onClick={onProfileClick}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              👤
            </button>
            
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-semibold text-gray-800">{userName}</p>
            </div>
            
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;