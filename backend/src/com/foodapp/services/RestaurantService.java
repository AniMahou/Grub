package com.foodapp.services;

import com.foodapp.dao.CSVHandler;
import com.foodapp.models.Restaurant;
import com.foodapp.models.MenuItem;
import java.util.*;

public class RestaurantService {
    private static final String RESTAURANT_FILE = "restaurants.csv";
    private static final String MENU_FILE = "menus.csv";
    
    // Get all restaurants
    public List<Restaurant> getAllRestaurants() {
        List<Restaurant> restaurants = new ArrayList<>();
        List<String[]> records = CSVHandler.readAll(RESTAURANT_FILE);
        
        for (String[] data : records) {
            restaurants.add(new Restaurant(
                Integer.parseInt(data[0]),
                data[1], data[2], data[3], data[4], data[5],
                Integer.parseInt(data[6]),
                Integer.parseInt(data[7])
            ));
        }
        return restaurants;
    }
    
    // Search restaurants by name/place/cuisine (real-time search)
    public List<Restaurant> searchRestaurants(String query) {
        List<Restaurant> all = getAllRestaurants();
        List<Restaurant> results = new ArrayList<>();
        String lowerQuery = query.toLowerCase();
        
        for (Restaurant r : all) {
            if (r.getName().toLowerCase().contains(lowerQuery) ||
                r.getPlace().toLowerCase().contains(lowerQuery) ||
                r.getCuisines().toLowerCase().contains(lowerQuery)) {
                results.add(r);
            }
        }
        return results;
    }
    
    // Filter restaurants by place
    public List<Restaurant> filterByPlace(List<Restaurant> restaurants, String place) {
        if (place == null || place.equals("all")) return restaurants;
        List<Restaurant> filtered = new ArrayList<>();
        for (Restaurant r : restaurants) {
            if (r.getPlace().equalsIgnoreCase(place)) {
                filtered.add(r);
            }
        }
        return filtered;
    }
    
    // Filter by cuisine
    public List<Restaurant> filterByCuisine(List<Restaurant> restaurants, String cuisine) {
        if (cuisine == null || cuisine.equals("all")) return restaurants;
        List<Restaurant> filtered = new ArrayList<>();
        for (Restaurant r : restaurants) {
            if (r.getCuisines().toLowerCase().contains(cuisine.toLowerCase())) {
                filtered.add(r);
            }
        }
        return filtered;
    }
    
    // Filter by delivery type
    public List<Restaurant> filterByDeliveryType(List<Restaurant> restaurants, String type) {
        if (type == null || type.equals("all")) return restaurants;
        List<Restaurant> filtered = new ArrayList<>();
        for (Restaurant r : restaurants) {
            if (r.getDeliveryTypes().toLowerCase().contains(type.toLowerCase())) {
                filtered.add(r);
            }
        }
        return filtered;
    }
    
    // Filter by offer
    public List<Restaurant> filterByOffer(List<Restaurant> restaurants, String hasOffer) {
        if (hasOffer == null || hasOffer.equals("all")) return restaurants;
        List<Restaurant> filtered = new ArrayList<>();
        for (Restaurant r : restaurants) {
            if (r.getHasOffer().equalsIgnoreCase(hasOffer)) {
                filtered.add(r);
            }
        }
        return filtered;
    }
    
    // Get restaurant by ID
    public Restaurant getRestaurantById(int id) {
        List<String[]> records = CSVHandler.readAll(RESTAURANT_FILE);
        for (String[] data : records) {
            if (Integer.parseInt(data[0]) == id) {
                return new Restaurant(
                    Integer.parseInt(data[0]), data[1], data[2], data[3],
                    data[4], data[5], Integer.parseInt(data[6]), Integer.parseInt(data[7])
                );
            }
        }
        return null;
    }
    
    // Get menu items for a restaurant
    public List<MenuItem> getMenuByRestaurant(int restaurantId) {
        List<MenuItem> menu = new ArrayList<>();
        List<String[]> records = CSVHandler.readAll(MENU_FILE);
        
        for (String[] data : records) {
            if (Integer.parseInt(data[1]) == restaurantId) {
                menu.add(new MenuItem(
                    Integer.parseInt(data[0]),
                    Integer.parseInt(data[1]),
                    data[2],
                    Double.parseDouble(data[3]),
                    data[4],
                    data[5]
                ));
            }
        }
        return menu;
    }
    
    // Filter menu by price range
    public List<MenuItem> filterMenuByPrice(List<MenuItem> menu, double min, double max) {
        List<MenuItem> filtered = new ArrayList<>();
        for (MenuItem item : menu) {
            if (item.getPrice() >= min && item.getPrice() <= max) {
                filtered.add(item);
            }
        }
        return filtered;
    }
    
    // Filter menu by cuisine
    public List<MenuItem> filterMenuByCuisine(List<MenuItem> menu, String cuisine) {
        if (cuisine == null || cuisine.equals("all")) return menu;
        List<MenuItem> filtered = new ArrayList<>();
        for (MenuItem item : menu) {
            if (item.getCuisine().equalsIgnoreCase(cuisine)) {
                filtered.add(item);
            }
        }
        return filtered;
    }
}