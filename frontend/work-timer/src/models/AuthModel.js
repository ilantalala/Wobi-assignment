// src/models/AuthModel.js
// Handles API calls related to authentication

const API_URL = 'http://localhost:3001/api';

class AuthModel {
  /**
   * Login user with credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Response with token and user info
   */
  static async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Verify JWT token
   * @returns {Promise<Object>} - Response with validation result
   */
  static async verifyToken() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }
  
  /**
   * Get auth headers with token
   * @returns {Object} - Headers object with Authorization
   */
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}

export default AuthModel;