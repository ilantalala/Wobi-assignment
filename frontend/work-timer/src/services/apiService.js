import { getToken } from './authService';

const API_URL = 'http://localhost:3001/api';

/**
 * Generic fetch function to handle API requests
 * Automatically adds JWT token to headers if available
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Handle unauthenticated responses
    if (response.status === 401) {
      // If token is invalid or expired, could redirect to login here
      // Example: window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};