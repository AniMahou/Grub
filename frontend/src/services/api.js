const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Restaurant endpoints
  async getRestaurants(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/restaurants${params ? `?${params}` : ''}`);
  }

  async getMenu(restaurantId, filters = {}) {
    const params = new URLSearchParams({ restaurantId, ...filters }).toString();
    return this.request(`/menu?${params}`);
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders(userId) {
    return this.request(`/orders/user/${userId}`);
  }

  // Payment endpoint
  async processPayment(paymentData) {
    return this.request('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Tracking endpoint
  async getTrackingStatus(orderId) {
    return this.request(`/tracking?orderId=${orderId}`);
  }
}

export default new ApiService();