const userModel = require('../models/userModel');

// Handle user login with JWT
async function login(req, res) {
  const { username, password } = req.body;
  
  try {
    const user = await userModel.validateUser(username, password);
    
    if (user) {
      res.json({ 
        success: true, 
        user: { 
          username: user.username, 
          role: user.role,
          token: user.token 
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
}

// Register a new user
async function register(req, res) {
  const { username, password, role } = req.body;
  
  try {
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const newUser = await userModel.createUser(username, password, role);
    
    res.status(201).json({
      success: true,
      user: {
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

module.exports = {
  login,
  register
};