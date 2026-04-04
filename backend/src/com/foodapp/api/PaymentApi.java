package com.foodapp.api;

import com.foodapp.services.PaymentService;
import com.foodapp.services.OrderService;
import com.foodapp.models.Order;

public class PaymentApi {
    private PaymentService paymentService;
    private OrderService orderService;
    
    public PaymentApi() {
        paymentService = new PaymentService();
        orderService = new OrderService();
    }
    
    public String processPayment(String requestBody) {
        try {
            System.out.println("Received payment request: " + requestBody);
            
            int orderId = extractInt(requestBody, "orderId");
            String paymentMethod = extractValue(requestBody, "paymentMethod");
            
            System.out.println("Processing payment for order: " + orderId + " with method: " + paymentMethod);
            
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                System.out.println("Order not found: " + orderId);
                return "{\"success\": false, \"error\": \"Order not found\"}";
            }
            
            boolean success = paymentService.processPayment(order, paymentMethod, order.getTotal());
            
            if (success) {
                System.out.println("Payment successful for order: " + orderId);
                return "{\"success\": true, \"message\": \"Payment successful\", \"orderId\": " + orderId + "}";
            } else {
                System.out.println("Payment failed for order: " + orderId);
                return "{\"success\": false, \"error\": \"Payment failed\"}";
            }
        } catch (Exception e) {
            System.err.println("Error processing payment: " + e.getMessage());
            e.printStackTrace();
            return "{\"success\": false, \"error\": \"" + e.getMessage() + "\"}";
        }
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