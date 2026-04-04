package com.foodapp.services;

import com.foodapp.dao.CSVHandler;
import com.foodapp.models.Order;
import com.foodapp.models.MenuItem;
import java.util.*;

public class OrderService {
    private static final String ORDER_FILE = "orders.csv";
    private RestaurantService restaurantService;
    
    public OrderService() {
        this.restaurantService = new RestaurantService();
    }
    
    // Create new order
    public Order createOrder(int userId, int restaurantId, String items, double total, String paymentMethod) {
        int newId = CSVHandler.getNextId(ORDER_FILE);
        long timestamp = System.currentTimeMillis();
        
        Order order = new Order(newId, userId, restaurantId, items, total, 
                                "active", paymentMethod, "preparing", timestamp);
        CSVHandler.append(ORDER_FILE, order.toCSV());
        
        System.out.println("Order saved to CSV - ID: " + newId);
        return order;
    }
    
    
    // Get orders by user ID
    public List<Order> getOrdersByUser(int userId) {
        List<Order> orders = new ArrayList<>();
        List<String[]> records = CSVHandler.readAll(ORDER_FILE);
        
        for (String[] data : records) {
            if (Integer.parseInt(data[1]) == userId) {
                orders.add(new Order(
                    Integer.parseInt(data[0]),
                    Integer.parseInt(data[1]),
                    Integer.parseInt(data[2]),
                    data[3],
                    Double.parseDouble(data[4]),
                    data[5],
                    data[6],
                    data[7],
                    Long.parseLong(data[8])
                ));
            }
        }
        return orders;
    }
    
    // Get order by ID
    public Order getOrderById(int orderId) {
        List<String[]> records = CSVHandler.readAll(ORDER_FILE);
        for (String[] data : records) {
            if (Integer.parseInt(data[0]) == orderId) {
                return new Order(
                    Integer.parseInt(data[0]),
                    Integer.parseInt(data[1]),
                    Integer.parseInt(data[2]),
                    data[3],
                    Double.parseDouble(data[4]),
                    data[5],
                    data[6],
                    data[7],
                    Long.parseLong(data[8])
                );
            }
        }
        return null;
    }
    
    // Update order tracking state
    public boolean updateTrackingState(int orderId, String newState) {
        List<String[]> records = CSVHandler.readAll(ORDER_FILE);
        boolean updated = false;
        
        for (int i = 0; i < records.size(); i++) {
            if (Integer.parseInt(records.get(i)[0]) == orderId) {
                records.get(i)[7] = newState;
                updated = true;
                break;
            }
        }
        
        if (updated) {
            CSVHandler.writeAll(ORDER_FILE, records);
        }
        return updated;
    }
    
    // Calculate total price from cart items
    public double calculateTotal(Map<Integer, Integer> cartItems) {
        double total = 0;
        for (Map.Entry<Integer, Integer> entry : cartItems.entrySet()) {
            int menuId = entry.getKey();
            int quantity = entry.getValue();
            
            // Find menu item price
            List<String[]> menus = CSVHandler.readAll("backend/data/menus.csv");
            for (String[] menu : menus) {
                if (Integer.parseInt(menu[0]) == menuId) {
                    total += Double.parseDouble(menu[3]) * quantity;
                    break;
                }
            }
        }
        return total;
    }
    
    // Format cart items to string for storage
    public String formatCartItems(Map<Integer, Integer> cartItems) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<Integer, Integer> entry : cartItems.entrySet()) {
            if (sb.length() > 0) sb.append(",");
            sb.append(entry.getKey()).append(":").append(entry.getValue());
        }
        return sb.toString();
    }
    
    // Parse cart items from string
    public Map<Integer, Integer> parseCartItems(String itemsStr) {
        Map<Integer, Integer> cart = new HashMap<>();
        if (itemsStr == null || itemsStr.isEmpty()) return cart;
        
        String[] pairs = itemsStr.split(",");
        for (String pair : pairs) {
            String[] parts = pair.split(":");
            cart.put(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
        }
        return cart;
    }
}