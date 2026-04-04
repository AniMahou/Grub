package com.foodapp.models;

public class Restaurant {
    private int id;
    private String name;
    private String place;
    private String cuisines;
    private String deliveryTypes;
    private String hasOffer;
    private int minPrice;
    private int maxPrice;
    
    public Restaurant(int id, String name, String place, String cuisines, 
                      String deliveryTypes, String hasOffer, int minPrice, int maxPrice) {
        this.id = id;
        this.name = name;
        this.place = place;
        this.cuisines = cuisines;
        this.deliveryTypes = deliveryTypes;
        this.hasOffer = hasOffer;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
    
    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getPlace() { return place; }
    public String getCuisines() { return cuisines; }
    public String getDeliveryTypes() { return deliveryTypes; }
    public String getHasOffer() { return hasOffer; }
    public int getMinPrice() { return minPrice; }
    public int getMaxPrice() { return maxPrice; }
    
    // Convert to CSV
    public String[] toCSV() {
        return new String[]{String.valueOf(id), name, place, cuisines, 
                           deliveryTypes, hasOffer, String.valueOf(minPrice), 
                           String.valueOf(maxPrice)};
    }
}