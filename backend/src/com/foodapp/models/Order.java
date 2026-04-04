package com.foodapp.models;

import java.util.*;

public class Order {
    private int id;
    private int userId;
    private int restaurantId;
    private String items;  // Format: "itemId:quantity,itemId:quantity"
    private double total;
    private String status;
    private String paymentMethod;
    private String trackingState;  // preparing, rider_got, on_the_way, delivered
    private long createdAt;
    
    public Order(int id, int userId, int restaurantId, String items, 
                 double total, String status, String paymentMethod, 
                 String trackingState, long createdAt) {
        this.id = id;
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.items = items;
        this.total = total;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.trackingState = trackingState;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public int getRestaurantId() { return restaurantId; }
    public String getItems() { return items; }
    public double getTotal() { return total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getTrackingState() { return trackingState; }
    public void setTrackingState(String trackingState) { this.trackingState = trackingState; }
    public long getCreatedAt() { return createdAt; }
    
    // Convert to CSV
    public String[] toCSV() {
        return new String[]{String.valueOf(id), String.valueOf(userId), 
                           String.valueOf(restaurantId), items, String.valueOf(total), 
                           status, paymentMethod, trackingState, String.valueOf(createdAt)};
    }
}