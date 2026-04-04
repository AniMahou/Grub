package com.foodapp.server;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.foodapp.api.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class SimpleHttpServer {
    private HttpServer server;
    private int port = 8080;
    
    // Initialize APIs
    private AuthApi authApi;
    private RestaurantApi restaurantApi;
    private MenuApi menuApi;
    private OrderApi orderApi;
    private PaymentApi paymentApi;
    private TrackingApi trackingApi;
    
    public SimpleHttpServer() {
        authApi = new AuthApi();
        restaurantApi = new RestaurantApi();
        menuApi = new MenuApi();
        orderApi = new OrderApi();
        paymentApi = new PaymentApi();
        trackingApi = new TrackingApi();
    }
    
    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        
        // Setup routes
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/restaurants", new RestaurantHandler());
        server.createContext("/api/menu", new MenuHandler());
        server.createContext("/api/orders", new OrderHandler());
        server.createContext("/api/payment", new PaymentHandler());
        server.createContext("/api/tracking", new TrackingHandler());
        
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port " + port);
        System.out.println("API available at: http://localhost:" + port + "/api/");
    }
    
    // Helper method to send response
    public static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        
        if (exchange.getRequestMethod().equals("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(responseBytes);
        os.close();
    }
    
    // Helper to read request body
    public static String readRequestBody(HttpExchange exchange) throws IOException {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
        BufferedReader br = new BufferedReader(isr);
        StringBuilder requestBody = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            requestBody.append(line);
        }
        return requestBody.toString();
    }
    
    // Handler classes
    class AuthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            String response = "";
            int status = 200;
            
            try {
                if (method.equals("POST") && path.equals("/api/auth/login")) {
                    String body = readRequestBody(exchange);
                    response = authApi.login(body);
                } 
                else if (method.equals("POST") && path.equals("/api/auth/register")) {
                    String body = readRequestBody(exchange);
                    response = authApi.register(body);
                }
                else {
                    status = 404;
                    response = "{\"error\": \"Not found\"}";
                }
            } catch (Exception e) {
                status = 500;
                response = "{\"error\": \"" + e.getMessage() + "\"}";
            }
            
            sendResponse(exchange, status, response);
        }
    }
    
    class RestaurantHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String query = exchange.getRequestURI().getQuery();
            String response = "";
            int status = 200;
            
            try {
                if (method.equals("GET")) {
                    response = restaurantApi.getRestaurants(query);
                } else {
                    status = 404;
                    response = "{\"error\": \"Not found\"}";
                }
            } catch (Exception e) {
                status = 500;
                response = "{\"error\": \"" + e.getMessage() + "\"}";
            }
            
            sendResponse(exchange, status, response);
        }
    }
    
    class MenuHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String query = exchange.getRequestURI().getQuery();
            String response = "";
            int status = 200;
            
            try {
                if (method.equals("GET")) {
                    response = menuApi.getMenu(query);
                } else {
                    status = 404;
                    response = "{\"error\": \"Not found\"}";
                }
            } catch (Exception e) {
                status = 500;
                response = "{\"error\": \"" + e.getMessage() + "\"}";
            }
            
            sendResponse(exchange, status, response);
        }
    }
    
    class OrderHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            String response = "";
            int status = 200;
            
            try {
                if (method.equals("POST")) {
                    String body = readRequestBody(exchange);
                    response = orderApi.createOrder(body);
                } 
                else if (method.equals("GET") && path.startsWith("/api/orders/user/")) {
                    String[] parts = path.split("/");
                    int userId = Integer.parseInt(parts[4]);
                    response = orderApi.getUserOrders(userId);
                }
                else {
                    status = 404;
                    response = "{\"error\": \"Not found\"}";
                }
            } catch (Exception e) {
                status = 500;
                response = "{\"error\": \"" + e.getMessage() + "\"}";
            }
            
            sendResponse(exchange, status, response);
        }
    }
    
    class PaymentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String response = "";
            int status = 200;
            
            try {
                if (method.equals("POST")) {
                    String body = readRequestBody(exchange);
                    response = paymentApi.processPayment(body);
                } else {
                    status = 404;
                    response = "{\"error\": \"Not found\"}";
                }
            } catch (Exception e) {
                status = 500;
                response = "{\"error\": \"" + e.getMessage() + "\"}";
            }
            
            sendResponse(exchange, status, response);
        }
    }
    
    class TrackingHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String query = exchange.getRequestURI().getQuery();
            String response = "";
            int status = 200;
            
            try {
                if (method.equals("GET")) {
                    response = trackingApi.getTrackingStatus(query);
                } else {
                    status = 404;
                    response = "{\"error\": \"Not found\"}";
                }
            } catch (Exception e) {
                status = 500;
                response = "{\"error\": \"" + e.getMessage() + "\"}";
            }
            
            sendResponse(exchange, status, response);
        }
    }
}