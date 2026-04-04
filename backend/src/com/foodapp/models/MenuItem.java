package com.foodapp.models;

public class MenuItem {
    private int id;
    private int restaurantId;
    private String name;
    private double price;
    private String cuisine;
    private String available;
    
    public MenuItem(int id, int restaurantId, String name, double price, 
                    String cuisine, String available) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.price = price;
        this.cuisine = cuisine;
        this.available = available;
    }
    
    // Getters
    public int getId() { return id; }
    public int getRestaurantId() { return restaurantId; }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public String getCuisine() { return cuisine; }
    public String getAvailable() { return available; }
    
    // Convert to CSV
    public String[] toCSV() {
        return new String[]{String.valueOf(id), String.valueOf(restaurantId), 
                           name, String.valueOf(price), cuisine, available};
    }
}