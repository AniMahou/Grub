import React, { useState } from 'react';
import api from '../services/api';

function Payment({ cart, total, userId, restaurantId, onPaymentComplete, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState('');

  const calculateSubtotal = () => {
    return total;
  };

  const calculateDeliveryFee = () => 50;
  const calculateTax = () => total * 0.05;
  
  const calculateFinalTotal = () => {
    let finalTotal = calculateSubtotal() + calculateDeliveryFee() + calculateTax();
    if (discount > 0) {
      finalTotal = finalTotal - discount;
    }
    return finalTotal;
  };

  const applyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      setDiscount(calculateSubtotal() * 0.1);
      setAppliedCoupon('WELCOME10 - 10% off');
      setError('');
    } else if (couponCode === 'SAVE20') {
      setDiscount(calculateSubtotal() * 0.2);
      setAppliedCoupon('SAVE20 - 20% off');
      setError('');
    } else if (couponCode === 'FLAT50') {
      setDiscount(50);
      setAppliedCoupon('FLAT50 - ৳50 off');
      setError('');
    } else if (couponCode) {
      setError('Invalid coupon code');
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare cart items
      const cartItems = {};
      cart.forEach(item => {
        cartItems[item.id] = item.quantity;
      });
      
      const cartItemsStr = Object.entries(cartItems)
        .map(([id, qty]) => `${id}:${qty}`)
        .join(',');
      
      console.log('Creating order with data:', {
        userId: userId,
        restaurantId: restaurantId,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon ? couponCode : '',
        cartItems: cartItemsStr
      });
      
      // Create order
      const orderResult = await api.createOrder({
        userId: userId,
        restaurantId: restaurantId,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon ? couponCode : '',
        cartItems: cartItemsStr
      });
      
      console.log('Order creation response:', orderResult);
      
      if (orderResult.success) {
        // Process payment
        const paymentResult = await api.processPayment({
          orderId: orderResult.orderId,
          paymentMethod: paymentMethod
        });
        
        console.log('Payment response:', paymentResult);
        
        if (paymentResult.success) {
          alert(`Order placed successfully! Order ID: ${orderResult.orderId}`);
          onPaymentComplete(orderResult.orderId);
        } else {
          setError('Payment failed: ' + (paymentResult.error || 'Unknown error'));
        }
      } else {
        setError('Order creation failed: ' + (orderResult.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Details</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span>{item.name} x{item.quantity}</span>
                <span>৳{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>৳{calculateDeliveryFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>৳{calculateTax().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>৳{calculateFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coupon Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Coupon Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 input-field"
              placeholder="Enter coupon code"
            />
            <button
              onClick={applyCoupon}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Apply
            </button>
          </div>
          {appliedCoupon && (
            <p className="text-green-600 text-sm mt-2">✓ {appliedCoupon} applied!</p>
          )}
          <div className="text-sm text-gray-500 mt-2">
            <p>Available coupons:</p>
            <p className="font-mono text-xs">WELCOME10 (10% off) | SAVE20 (20% off) | FLAT50 (৳50 off)</p>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-3">Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                paymentMethod === 'cash'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">💵</div>
              <div className="font-semibold">Cash on Delivery</div>
              <div className="text-sm text-gray-500">Pay when you receive</div>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                paymentMethod === 'card'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">💳</div>
              <div className="font-semibold">Card Payment</div>
              <div className="text-sm text-gray-500">Credit/Debit card</div>
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay ৳${calculateFinalTotal().toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;