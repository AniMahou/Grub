package com.foodapp.services;

import com.foodapp.dao.CSVHandler;
import com.foodapp.models.User;
import java.util.*;

public class UserService {
    private static final String USER_FILE = "users.csv";  // Just filename, not full path    
    // Register new user
    public boolean register(String email, String password, String name) {
        // Check if user already exists
        List<String[]> users = CSVHandler.readAll(USER_FILE);
        for (String[] userData : users) {
            if (userData[1].equals(email)) {
                return false; // User already exists
            }
        }
        
        // Create new user
        int newId = CSVHandler.getNextId(USER_FILE);
        User newUser = new User(newId, email, password, name);
        CSVHandler.append(USER_FILE, newUser.toCSV());
        return true;
    }
    
    // Login user
    public User login(String email, String password) {
        List<String[]> users = CSVHandler.readAll(USER_FILE);
        for (String[] userData : users) {
            if (userData[1].equals(email) && userData[2].equals(password)) {
                return new User(
                    Integer.parseInt(userData[0]),
                    userData[1],
                    userData[2],
                    userData[3]
                );
            }
        }
        return null;
    }
    
    // Get user by ID
    public User getUserById(int id) {
        List<String[]> users = CSVHandler.readAll(USER_FILE);
        for (String[] userData : users) {
            if (Integer.parseInt(userData[0]) == id) {
                return new User(
                    Integer.parseInt(userData[0]),
                    userData[1],
                    userData[2],
                    userData[3]
                );
            }
        }
        return null;
    }
}