package com.foodapp.api;

import com.foodapp.services.OrderService;
import com.foodapp.models.Order;
import com.foodapp.tracking.OrderTracker;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public class OrderApi {
    private OrderService orderService;
    
    public OrderApi() {
        orderService = new OrderService();
    }
    
    public String createOrder(String requestBody) {
        try {
            System.out.println("Received order request: " + requestBody);
            
            // Parse request
            int userId = extractInt(requestBody, "userId");
            int restaurantId = extractInt(requestBody, "restaurantId");
            String paymentMethod = extractValue(requestBody, "paymentMethod");
            String couponCode = extractValue(requestBody, "couponCode");
            String cartItemsStr = extractValue(requestBody, "cartItems");
            
            System.out.println("Parsed - userId: " + userId + ", restaurantId: " + restaurantId);
            System.out.println("cartItems: " + cartItemsStr);
            
            // Parse cart items
            Map<Integer, Integer> cartItems = new HashMap<>();
            if (!cartItemsStr.isEmpty()) {
                String[] items = cartItemsStr.split(",");
                for (String item : items) {
                    String[] parts = item.split(":");
                    if (parts.length == 2) {
                        cartItems.put(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
                    }
                }
            }
            
            // Calculate total
            double total = orderService.calculateTotal(cartItems);
            System.out.println("Calculated total: " + total);
            
            // Apply discount if coupon exists
            com.foodapp.services.PaymentService paymentService = new com.foodapp.services.PaymentService();
            total = paymentService.applyDiscount(total, couponCode);
            System.out.println("Total after discount: " + total);
            
            // Format items for storage
            String itemsFormatted = orderService.formatCartItems(cartItems);
            
            // Create order
            Order order = orderService.createOrder(userId, restaurantId, itemsFormatted, total, paymentMethod);
            System.out.println("Order created with ID: " + order.getId());
            
            // Start tracking
            OrderTracker.getInstance().startTracking(order.getId());
            
            return "{\"success\": true, \"orderId\": " + order.getId() + ", \"total\": " + total + "}";
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return "{\"success\": false, \"error\": \"" + e.getMessage() + "\"}";
        }
    }
    
    public String getUserOrders(int userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        
        StringBuilder json = new StringBuilder("{\"orders\": [");
        for (int i = 0; i < orders.size(); i++) {
            Order o = orders.get(i);
            if (i > 0) json.append(",");
            json.append("{")
                .append("\"id\":").append(o.getId()).append(",")
                .append("\"restaurantId\":").append(o.getRestaurantId()).append(",")
                .append("\"items\":\"").append(o.getItems()).append("\",")
                .append("\"total\":").append(o.getTotal()).append(",")
                .append("\"trackingState\":\"").append(o.getTrackingState()).append("\",")
                .append("\"status\":\"").append(o.getStatus()).append("\",")
                .append("\"createdAt\":").append(o.getCreatedAt())
                .append("}");
        }
        json.append("]}");
        
        return json.toString();
    }
    
    private String extractValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) {
            searchKey = "\"" + key + "\": \"";
            startIndex = json.indexOf(searchKey);
        }
        if (startIndex == -1) return "";
        
        startIndex += searchKey.length();
        int endIndex = json.indexOf("\"", startIndex);
        if (endIndex == -1) return "";
        
        return json.substring(startIndex, endIndex);
    }
    
    private int extractInt(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) return 0;
        
        startIndex += searchKey.length();
        int endIndex = json.indexOf(",", startIndex);
        if (endIndex == -1) endIndex = json.indexOf("}", startIndex);
        if (endIndex == -1) return 0;
        
        String value = json.substring(startIndex, endIndex).trim();
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}