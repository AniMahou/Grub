package com.foodapp.services;

import com.foodapp.models.Order;
import java.util.*;

public class PaymentService {
    
    // Process payment (dummy implementation)
    public boolean processPayment(Order order, String paymentMethod, double amount) {
        // No real payment integration - just dummy validation
        if (amount <= 0) return false;
        
        if (paymentMethod.equalsIgnoreCase("cash")) {
            return true; // Cash on delivery always accepted
        } else if (paymentMethod.equalsIgnoreCase("card")) {
            return true; // Dummy card payment always succeeds
        }
        
        return false;
    }
    
    // Apply discount if available
    public double applyDiscount(double total, String couponCode) {
        if (couponCode == null || couponCode.isEmpty()) return total;
        
        // Simple dummy coupons
        if (couponCode.equals("WELCOME10")) {
            return total * 0.9; // 10% off
        } else if (couponCode.equals("SAVE20")) {
            return total * 0.8; // 20% off
        } else if (couponCode.equals("FLAT50")) {
            return Math.max(0, total - 50); // 50 taka off
        }
        
        return total; // Invalid coupon
    }
    
    // Check if restaurant has offer
    public boolean hasRestaurantOffer(int restaurantId) {
        com.foodapp.services.RestaurantService restaurantService = new com.foodapp.services.RestaurantService();
        com.foodapp.models.Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        return restaurant != null && restaurant.getHasOffer().equals("yes");
    }
}