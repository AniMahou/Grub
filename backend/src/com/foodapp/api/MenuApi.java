package com.foodapp.api;

import com.foodapp.services.RestaurantService;
import com.foodapp.models.MenuItem;
import java.util.List;
import java.net.URLDecoder;

public class MenuApi {
    private RestaurantService restaurantService;
    
    public MenuApi() {
        restaurantService = new RestaurantService();
    }
    
    public String getMenu(String queryString) {
        int restaurantId = 0;
        double minPrice = 0;
        double maxPrice = 10000;
        String cuisine = "all";
        
        if (queryString != null) {
            String[] params = queryString.split("&");
            for (String param : params) {
                String[] pair = param.split("=");
                if (pair.length == 2) {
                    try {
                        String key = URLDecoder.decode(pair[0], "UTF-8");
                        String value = URLDecoder.decode(pair[1], "UTF-8");
                        
                        if (key.equals("restaurantId")) restaurantId = Integer.parseInt(value);
                        else if (key.equals("minPrice")) minPrice = Double.parseDouble(value);
                        else if (key.equals("maxPrice")) maxPrice = Double.parseDouble(value);
                        else if (key.equals("cuisine")) cuisine = value;
                    } catch (Exception e) {}
                }
            }
        }
        
        List<MenuItem> menu = restaurantService.getMenuByRestaurant(restaurantId);
        menu = restaurantService.filterMenuByPrice(menu, minPrice, maxPrice);
        menu = restaurantService.filterMenuByCuisine(menu, cuisine);
        
        StringBuilder json = new StringBuilder("{\"menu\": [");
        for (int i = 0; i < menu.size(); i++) {
            MenuItem m = menu.get(i);
            if (i > 0) json.append(",");
            json.append("{")
                .append("\"id\":").append(m.getId()).append(",")
                .append("\"name\":\"").append(m.getName()).append("\",")
                .append("\"price\":").append(m.getPrice()).append(",")
                .append("\"cuisine\":\"").append(m.getCuisine()).append("\",")
                .append("\"available\":\"").append(m.getAvailable()).append("\"")
                .append("}");
        }
        json.append("]}");
        
        return json.toString();
    }
}