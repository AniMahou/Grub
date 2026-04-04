package com.foodapp.api;

import com.foodapp.services.UserService;
import com.foodapp.models.User;

public class AuthApi {
    private UserService userService;
    
    public AuthApi() {
        userService = new UserService();
    }
    
    public String login(String requestBody) {
        // Manual parsing of JSON-like string
        String email = extractValue(requestBody, "email");
        String password = extractValue(requestBody, "password");
        
        User user = userService.login(email, password);
        
        if (user != null) {
            return "{\"success\": true, \"userId\": " + user.getId() + 
                   ", \"name\": \"" + user.getName() + "\", \"email\": \"" + user.getEmail() + "\"}";
        } else {
            return "{\"success\": false, \"error\": \"Invalid credentials\"}";
        }
    }
    
    public String register(String requestBody) {
        String email = extractValue(requestBody, "email");
        String password = extractValue(requestBody, "password");
        String name = extractValue(requestBody, "name");
        
        boolean success = userService.register(email, password, name);
        
        if (success) {
            return "{\"success\": true, \"message\": \"Registration successful\"}";
        } else {
            return "{\"success\": false, \"error\": \"Email already exists\"}";
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
}