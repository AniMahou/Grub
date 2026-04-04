import React from 'react';

function OrderTracking({ order, onClose }) {
  const getStepIndex = (state) => {
    const steps = ['preparing', 'rider_got', 'on_the_way', 'delivered'];
    return steps.indexOf(state);
  };

  const currentStep = getStepIndex(order.state);
  const steps = [
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'rider_got', label: 'Rider Got', icon: '🏍️' },
    { key: 'on_the_way', label: 'On The Way', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl max-w-sm w-full z-50 animate-slide-up">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-800">Order Tracking</h3>
            <p className="text-xs text-gray-500">Order #{order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="relative mb-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex-1 text-center">
                <div className="relative">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                      index <= currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 transition-all ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ transform: 'translateY(-50%)' }}
                    />
                  )}
                </div>
                <p className="text-xs mt-1 text-gray-600 hidden sm:block">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Message */}
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-blue-800 text-center">
            {order.displayState}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Updates every 5 seconds
        </p>
      </div>
      
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default OrderTracking;