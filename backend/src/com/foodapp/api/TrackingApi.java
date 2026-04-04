package com.foodapp.api;

import com.foodapp.services.OrderService;
import com.foodapp.models.Order;
import java.net.URLDecoder;

public class TrackingApi {
    private OrderService orderService;
    
    public TrackingApi() {
        orderService = new OrderService();
    }
    
    public String getTrackingStatus(String queryString) {
        int orderId = 0;
        
        if (queryString != null) {
            String[] params = queryString.split("&");
            for (String param : params) {
                String[] pair = param.split("=");
                if (pair.length == 2 && pair[0].equals("orderId")) {
                    try {
                        orderId = Integer.parseInt(URLDecoder.decode(pair[1], "UTF-8"));
                    } catch (Exception e) {}
                }
            }
        }
        
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return "{\"success\": false, \"error\": \"Order not found\"}";
        }
        
        String displayState = "";
        switch(order.getTrackingState()) {
            case "preparing":
                displayState = "Preparing your food";
                break;
            case "rider_got":
                displayState = "Rider picked up the order";
                break;
            case "on_the_way":
                displayState = "On the way to your location";
                break;
            case "delivered":
                displayState = "Delivered successfully";
                break;
        }
        
        return "{\"success\": true, \"orderId\": " + order.getId() + 
               ", \"state\": \"" + order.getTrackingState() + "\"" +
               ", \"displayState\": \"" + displayState + "\"" +
               ", \"total\": " + order.getTotal() + 
               ", \"items\": \"" + order.getItems() + "\"}";
    }
}