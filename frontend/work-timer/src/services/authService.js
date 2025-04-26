import { fetchApi } from './apiService';

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get stored token
const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token (logout)
const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Login user with username and password
 */
export const login = async (username, password) => {
  try {
    const data = await fetchApi('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (data.success && data.user.token) {
      setToken(data.user.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};

/**
 * Register a new user
 */
export const register = async (username, password, role = 'user') => {
  try {
    const data = await fetchApi('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    });
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed');
  }
};

/**
 * Logout user (clear token)
 */
export const logout = () => {
  removeToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

export { getToken };