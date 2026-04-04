import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Profile({ userId, onTrackOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await api.getUserOrders(userId);
    setOrders(data.orders || []);
    setLoading(false);
  };

  const trackOrder = async (orderId) => {
    const data = await api.getTrackingStatus(orderId);
    if (data.success) {
      setTrackingInfo(data);
      onTrackOrder(orderId);
    }
  };

  const getStatusDisplay = (state) => {
    const statusMap = {
      'preparing': { text: 'Preparing', color: 'bg-yellow-500', icon: '👨‍🍳' },
      'rider_got': { text: 'Rider Assigned', color: 'bg-blue-500', icon: '🏍️' },
      'on_the_way': { text: 'On The Way', color: 'bg-purple-500', icon: '🚚' },
      'delivered': { text: 'Delivered', color: 'bg-green-500', icon: '✅' }
    };
    return statusMap[state] || { text: state, color: 'bg-gray-500', icon: '📦' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h2>
        <p className="text-gray-600">User ID: {userId}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Order History</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders yet</p>
            <p className="text-gray-400 text-sm">Start ordering from restaurants!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = getStatusDisplay(order.trackingState);
              return (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${status.color}`}>
                        {status.icon} {status.text}
                      </span>
                      <p className="font-bold text-green-600 mt-1">৳{order.total}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Items: {order.items}</p>
                  </div>
                  
                  <button
                    onClick={() => trackOrder(order.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                  >
                    Track Order →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Tracking Modal */}
      {trackingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Order #{trackingInfo.orderId}</h3>
              <button
                onClick={() => setTrackingInfo(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Preparing</span>
                <span>Rider</span>
                <span>On Way</span>
                <span>Delivered</span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{
                      width: trackingInfo.state === 'preparing' ? '25%' :
                             trackingInfo.state === 'rider_got' ? '50%' :
                             trackingInfo.state === 'on_the_way' ? '75%' : '100%'
                    }}
                  />
                </div>
              </div>
              <p className="text-center mt-3 font-semibold text-gray-700">
                {trackingInfo.displayState}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Order Details</h4>
              <p className="text-sm text-gray-600">Total: ৳{trackingInfo.total}</p>
              <p className="text-sm text-gray-600">Items: {trackingInfo.items}</p>
            </div>
            
            <button
              onClick={() => setTrackingInfo(null)}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;