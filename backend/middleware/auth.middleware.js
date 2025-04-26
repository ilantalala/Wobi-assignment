// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt.config');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer header
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'token_expired' });
      }
      return res.status(403).json({ error: 'Invalid token', code: 'invalid_token' });
    }
    
    // Add user info to request
    req.user = user;
    next();
  });
};

/**
 * Middleware to check admin role
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      code: 'admin_required'
    });
  }
  next();
};

/**
 * Middleware to check if user is accessing their own data or is admin
 */
const isSelfOrAdmin = (req, res, next) => {
  const { username } = req.params;
  
  if (req.user.role === 'admin' || req.user.username === username) {
    return next();
  }
  
  return res.status(403).json({ 
    error: 'Unauthorized access to another user\'s data',
    code: 'unauthorized_access'
  });
};

module.exports = {
  authenticateToken,
  isAdmin,
  isSelfOrAdmin
};