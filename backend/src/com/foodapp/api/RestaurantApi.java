package com.foodapp.api;

import com.foodapp.services.RestaurantService;
import com.foodapp.models.Restaurant;
import java.util.List;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class RestaurantApi {
    private RestaurantService restaurantService;
    
    public RestaurantApi() {
        restaurantService = new RestaurantService();
    }
    
    public String getRestaurants(String queryString) {
        String searchQuery = "";
        String place = "all";
        String cuisine = "all";
        String deliveryType = "all";
        String offer = "all";
        
        if (queryString != null) {
            String[] params = queryString.split("&");
            for (String param : params) {
                String[] pair = param.split("=");
                if (pair.length == 2) {
                    try {
                        String key = URLDecoder.decode(pair[0], "UTF-8");
                        String value = URLDecoder.decode(pair[1], "UTF-8");
                        
                        if (key.equals("search")) searchQuery = value;
                        else if (key.equals("place")) place = value;
                        else if (key.equals("cuisine")) cuisine = value;
                        else if (key.equals("deliveryType")) deliveryType = value;
                        else if (key.equals("offer")) offer = value;
                    } catch (UnsupportedEncodingException e) {}
                }
            }
        }
        
        List<Restaurant> restaurants;
        if (searchQuery != null && !searchQuery.isEmpty()) {
            restaurants = restaurantService.searchRestaurants(searchQuery);
        } else {
            restaurants = restaurantService.getAllRestaurants();
        }
        
        // Apply filters
        restaurants = restaurantService.filterByPlace(restaurants, place);
        restaurants = restaurantService.filterByCuisine(restaurants, cuisine);
        restaurants = restaurantService.filterByDeliveryType(restaurants, deliveryType);
        restaurants = restaurantService.filterByOffer(restaurants, offer);
        
        // Convert to JSON
        StringBuilder json = new StringBuilder("{\"restaurants\": [");
        for (int i = 0; i < restaurants.size(); i++) {
            Restaurant r = restaurants.get(i);
            if (i > 0) json.append(",");
            json.append("{")
                .append("\"id\":").append(r.getId()).append(",")
                .append("\"name\":\"").append(r.getName()).append("\",")
                .append("\"place\":\"").append(r.getPlace()).append("\",")
                .append("\"cuisines\":\"").append(r.getCuisines()).append("\",")
                .append("\"deliveryTypes\":\"").append(r.getDeliveryTypes()).append("\",")
                .append("\"hasOffer\":\"").append(r.getHasOffer()).append("\",")
                .append("\"minPrice\":").append(r.getMinPrice()).append(",")
                .append("\"maxPrice\":").append(r.getMaxPrice())
                .append("}");
        }
        json.append("]}");
        
        return json.toString();
    }
}