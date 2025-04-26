// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { JWT_SECRET, JWT_OPTIONS } = require('../config/jwt.config');

/**
 * User login
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Get user from model
    const user = await userModel.findByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password with bcrypt
    const passwordMatches = await bcrypt.compare(password, user.password);
    
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role }, 
      JWT_SECRET,
      JWT_OPTIONS
    );
    
    res.json({
      success: true,
      user: { username: user.username, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
};

/**
 * Verify token
 */
const verifyToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    res.json({ valid: true, user });
  });
};

module.exports = {
  login,
  verifyToken
};