# 🍕 Food Delivery Application

A robust, full-stack "Mini Food Delivery" platform designed to simplify the food ordering experience. This project features a modern React-based frontend and a custom Java backend with CSV-based data persistence.

## 📝 Project Idea

The core idea of this project is to provide a lightweight yet functional food delivery ecosystem. It demonstrates a complete flow from user authentication to real-time order tracking, bridging a responsive user interface with a custom-built server architectural pattern.

## ✨ Key Features

- **🔐 User Authentication:** Secure signup and login system for personalized user experiences.
- **🏠 Restaurant Discovery:** Browse through a variety of listed restaurants with search and filtering capabilities.
- **🍴 Dynamic Menus:** Explore detailed menus for each restaurant, featuring categories, descriptions, and pricing.
- **🛒 Cart Management:** Seamlessly add/remove items and adjust quantities in a real-time responsive shopping cart.
- **💳 Simulated Checkout:** A smooth multi-step checkout process including payment simulation.
- **📍 Real-time Order Tracking:** Monitor your order status with live updates (Preparing → Out for Delivery → Delivered).
- **👤 User Profile:** Manage account details and view order history for easy re-ordering.
- **📊 CSV Data Persistence:** A zero-config data storage solution using local CSV files for easy setup and portable data.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19
- **Styling:** Tailwind CSS (Modern, responsive design)
- **State Management:** React Hooks (useState, useEffect)
- **Icons/Assets:** SVG-based iconography

### Backend
- **Language:** Java (OpenJDK)
- **Server:** Custom Simple HTTP Server implementation
- **Data Architecture:** DAO (Data Access Object) pattern
- **Database:** Flat CSV files (`users.csv`, `restaurants.csv`, `menus.csv`, `orders.csv`)

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **OpenJDK / Java Development Kit (JDK)** (v11 or higher)
- **npm** or **yarn**

### 1. Backend Setup (Java)
The backend runs on a custom HTTP server on port `8080`.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Compile the Java source code:
    ```bash
    javac -d . src/com/foodapp/Main.java src/com/foodapp/**/*.java
    ```
3.  Run the application:
    ```bash
    java com.foodapp.Main
    ```
    *Note: Ensure the `data/` directory contains the necessary CSV files.*

### 2. Frontend Setup (React)
The frontend connects to the backend API.

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📁 Project Structure

```text
.
├── backend/
│   ├── src/com/foodapp/      # Java source code (Core logic, server, DAO)
│   ├── data/                 # CSV data files (Database)
│   └── lib/                  # External libraries (if any)
├── frontend/
│   ├── src/components/       # UI Components (Navbar, Cart, etc.)
│   ├── src/services/         # API Service layer
│   └── src/utils/            # Helper functions
└── README.md
```

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
