
import { toast } from "sonner";

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export interface BoxConfig {
  name: string;
  description: string;
  frequency: "monthly" | "bi-monthly" | "quarterly";
  preferences: string[];
  products: Product[];
  total: number;
  nextDeliveryDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription?: BoxConfig;
}

// API URL - updated to work in both dev and production
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5050/api';

// Currency symbol - now using Indian Rupees
export const CURRENCY_SYMBOL = "₹";

// Helper for making authenticated requests
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'x-auth-token': token || ''
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Handle authentication errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication required. Please log in.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// API functions
export const api = {
  // Get AI recommendations based on user preferences
  async getRecommendations(preferences: string[]): Promise<Product[]> {
    try {
      const data = await authFetch('/chat/recommendations', {
        method: 'POST',
        body: JSON.stringify({ preferences }),
      });
      
      // Transform to match our Product interface
      return data.map((item: any) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category
      }));
    } catch (error: any) {
      console.error("Error getting recommendations:", error);
      
      // Special handling for auth errors
      if (error.message.includes('Authentication required')) {
        return [];
      }
      
      toast.error("Failed to get recommendations");
      return [];
    }
  },
  
  // Process chat with AI - now using real OpenAI API
  async processChat(message: string): Promise<string> {
    try {
      const data = await authFetch('/chat/message', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      
      return data.response;
    } catch (error: any) {
      console.error("Error processing chat:", error);
      
      // Special handling for auth errors
      if (error.message.includes('Authentication required')) {
        return "You need to be logged in to chat with the AI assistant. Please log in or sign up to continue.";
      }
      
      return "I'm sorry, I'm having trouble connecting to the AI service. This could be because the API key is not set or there's a network issue. Please try again later.";
    }
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null && localStorage.getItem('user') !== null;
  },
  
  // User authentication
  async login(email: string, password: string): Promise<User> {
    try {
      const data = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      }).then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      });
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      }));
      
      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      };
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  },
  
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const data = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
      }).then(res => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      });
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      }));
      
      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      };
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  },
  
  // Subscription management
  async saveSubscription(userId: string, boxConfig: BoxConfig): Promise<boolean> {
    try {
      // Transform products array for the backend
      const products = boxConfig.products.map(product => ({
        product: product.id,
        quantity: 1
      }));
      
      await authFetch('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({
          ...boxConfig,
          products
        }),
      });
      
      toast.success("Your subscription has been saved!");
      return true;
    } catch (error: any) {
      console.error("Error saving subscription:", error);
      
      // Special handling for auth errors
      if (error.message.includes('Authentication required')) {
        toast.error("Please log in to save your subscription");
      } else {
        toast.error("Failed to save your subscription");
      }
      
      return false;
    }
  },
  
  // Get all subscriptions for the current user
  async getSubscriptions(): Promise<any[]> {
    try {
      const data = await authFetch('/subscriptions');
      return data;
    } catch (error: any) {
      console.error("Error getting subscriptions:", error);
      
      // Special handling for auth errors
      if (!error.message.includes('Authentication required')) {
        toast.error("Failed to load your subscriptions");
      }
      
      return [];
    }
  },
  
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await authFetch('/auth/me');
      
      return {
        id: data._id,
        name: data.name,
        email: data.email
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },
  
  // Initialize some demo products in the database (for development)
  async initDemoProducts(): Promise<boolean> {
    try {
      // This would typically be an admin function
      // Here we could add code to seed the database
      return true;
    } catch (error) {
      console.error("Error initializing demo products:", error);
      return false;
    }
  }
};
