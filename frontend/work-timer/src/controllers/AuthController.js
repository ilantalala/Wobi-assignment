// src/controllers/AuthController.js
import AuthModel from '../models/AuthModel';
import { validateLoginForm } from '../utils/validation';

class AuthController {
  /**
   * Handle user login
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {Function} setUser - Function to set user state
   * @param {Function} setError - Function to set error state
   * @returns {Promise<boolean>} - Success status
   */
  static async login(username, password, setUser, setError) {
    try {
      setError('');
      
      // Validate input
      const validationError = validateLoginForm(username, password);
      if (validationError) {
        setError(validationError);
        return false;
      }
      
      // Call API through model
      const response = await AuthModel.login(username, password);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Update state
      setUser(response.user);
      return true;
    } catch (error) {
      setError(error.message || 'Login failed');
      return false;
    }
  }
  
  /**
   * Handle user logout
   * @param {Function} setUser - Function to set user state
   */
  static logout(setUser) {
    // Remove token
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
  }
  
  /**
   * Check authentication status
   * @param {Function} setUser - Function to set user state
   * @param {Function} setLoading - Function to set loading state
   */
  static async checkAuth(setUser, setLoading) {
    try {
      setLoading(true);
      
      // Verify token
      const response = await AuthModel.verifyToken();
      
      // Update state if valid
      if (response.valid) {
        setUser(response.user);
      }
    } catch (error) {
      // Clear invalid auth
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
}

export default AuthController;