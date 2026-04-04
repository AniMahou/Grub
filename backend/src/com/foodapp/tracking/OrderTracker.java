package com.foodapp.tracking;

import com.foodapp.services.OrderService;
import com.foodapp.models.Order;
import java.util.concurrent.*;

public class OrderTracker {
    private static OrderTracker instance;
    private ScheduledExecutorService scheduler;
    private OrderService orderService;
    
    private OrderTracker() {
        scheduler = Executors.newScheduledThreadPool(1);
        orderService = new OrderService();
    }
    
    public static OrderTracker getInstance() {
        if (instance == null) {
            instance = new OrderTracker();
        }
        return instance;
    }
    
    // Start tracking a specific order
    public void startTracking(int orderId) {
        scheduler.schedule(new TrackingTask(orderId, 0), 5, TimeUnit.SECONDS);
    }
    
    // Tracking task that updates states every 5 seconds
    private class TrackingTask implements Runnable {
        private int orderId;
        private int step;
        
        public TrackingTask(int orderId, int step) {
            this.orderId = orderId;
            this.step = step;
        }
        
        @Override
        public void run() {
            Order order = orderService.getOrderById(orderId);
            if (order == null || order.getStatus().equals("completed")) {
                return;
            }
            
            String[] states = {"preparing", "rider_got", "on_the_way", "delivered"};
            
            if (step < states.length) {
                String newState = states[step];
                orderService.updateTrackingState(orderId, newState);
                System.out.println("Order " + orderId + " state updated to: " + newState);
                
                // Schedule next update
                if (step + 1 < states.length) {
                    scheduler.schedule(new TrackingTask(orderId, step + 1), 5, TimeUnit.SECONDS);
                } else {
                    // Order completed
                    orderService.updateTrackingState(orderId, "delivered");
                    System.out.println("Order " + orderId + " completed!");
                }
            }
        }
    }
    
    // Shutdown tracker
    public void shutdown() {
        scheduler.shutdown();
    }
}