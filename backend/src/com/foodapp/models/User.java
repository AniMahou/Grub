package com.foodapp.models;

public class User {
    private int id;
    private String email;
    private String password;
    private String name;
    
    public User(int id, String email, String password, String name) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
    }
    
    // Getters
    public int getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    
    // Setters
    public void setId(int id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    
    // Convert to CSV format
    public String[] toCSV() {
        return new String[]{String.valueOf(id), email, password, name};
    }
}