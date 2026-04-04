import React, { useState, useEffect } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import RestaurantList from './components/RestaurantList';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import Payment from './components/Payment';
import OrderTracking from './components/OrderTracking';
import Profile from './components/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn && currentView === 'profile') {
      // Refresh profile data
    }
  }, [isLoggedIn, currentView]);

  const handleLogin = async (email, password) => {
    const data = await api.login(email, password);
    if (data.success) {
      setIsLoggedIn(true);
      setUserId(data.userId);
      setUserName(data.name);
      setError('');
      setCurrentView('restaurants');
      return true;
    } else {
      setError(data.error);
      return false;
    }
  };

  const handleRegister = async (email, password, name) => {
    const data = await api.register(email, password, name);
    if (data.success) {
      setError('Registration successful! Please login.');
      setShowLogin(true);
      return true;
    } else {
      setError(data.error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserName('');
    setCart([]);
    setCurrentView('restaurants');
    setSelectedRestaurant(null);
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c => 
        c.id === itemId ? { ...c, quantity } : c
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const startTracking = async (orderId) => {
    const interval = setInterval(async () => {
      const data = await api.getTrackingStatus(orderId);
      if (data.success) {
        setTrackingOrder(data);
        if (data.state === 'delivered') {
          clearInterval(interval);
          setTimeout(() => setTrackingOrder(null), 5000);
        }
      }
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">🍕 Food Delivery</h1>
            <p className="text-gray-600 mt-2">Order from your favorite restaurants</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => { setShowLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                showLogin 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setShowLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                !showLogin 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {showLogin ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Signup onRegister={handleRegister} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        userName={userName} 
        onLogout={handleLogout}
        cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onCartClick={() => setCurrentView('cart')}
        onProfileClick={() => setCurrentView('profile')}
        onHomeClick={() => {
          setCurrentView('restaurants');
          setSelectedRestaurant(null);
        }}
      />
      
      {trackingOrder && (
        <OrderTracking 
          order={trackingOrder} 
          onClose={() => setTrackingOrder(null)} 
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {currentView === 'restaurants' && !selectedRestaurant && (
          <RestaurantList 
            onSelectRestaurant={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setCurrentView('menu');
            }} 
          />
        )}
        
        {currentView === 'menu' && selectedRestaurant && (
          <MenuList 
            restaurant={selectedRestaurant}
            onAddToCart={addToCart}
            onBack={() => {
              setSelectedRestaurant(null);
              setCurrentView('restaurants');
            }}
            onViewCart={() => setCurrentView('cart')}
          />
        )}
        
        {currentView === 'cart' && (
          <Cart 
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={() => setCurrentView('payment')}
            onBack={() => {
              if (selectedRestaurant) {
                setCurrentView('menu');
              } else {
                setCurrentView('restaurants');
              }
            }}
          />
        )}
        
        {currentView === 'payment' && (
          <Payment 
            cart={cart}
            total={calculateTotal()}
            userId={userId}
            restaurantId={selectedRestaurant?.id}
            onPaymentComplete={async (orderId) => {
              setCurrentOrder({ orderId });
              await startTracking(orderId);
              clearCart();
              setCurrentView('restaurants');
              setSelectedRestaurant(null);
              // Show success message
              alert(`Order placed successfully! Order ID: ${orderId}`);
            }}
            onBack={() => setCurrentView('cart')}
          />
        )}
        
        {currentView === 'profile' && (
          <Profile 
            userId={userId}
            onTrackOrder={(orderId) => {
              startTracking(orderId);
              setCurrentView('restaurants');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;