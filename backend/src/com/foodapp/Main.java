package com.foodapp;

import com.foodapp.server.SimpleHttpServer;
import com.foodapp.tracking.OrderTracker;

public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("Starting Food Delivery Application...");
            System.out.println("=====================================");
            
            // Start HTTP Server
            SimpleHttpServer server = new SimpleHttpServer();
            server.start();
            
            System.out.println("✅ Server is running!");
            System.out.println("📍 API Base URL: http://localhost:8080/api/");
            System.out.println("📍 Available endpoints:");
            System.out.println("   POST /api/auth/login");
            System.out.println("   POST /api/auth/register");
            System.out.println("   GET  /api/restaurants?search=...&place=...");
            System.out.println("   GET  /api/menu?restaurantId=...");
            System.out.println("   POST /api/orders");
            System.out.println("   POST /api/payment");
            System.out.println("   GET  /api/tracking?orderId=...");
            System.out.println("   GET  /api/orders/user/{userId}");
            System.out.println("\n⚠️  Make sure CSV files exist in backend/data/");
            System.out.println("=====================================");
            
            // Add shutdown hook
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("\nShutting down server...");
                OrderTracker.getInstance().shutdown();
            }));
            
        } catch (Exception e) {
            System.err.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}