const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
require('dotenv').config();

// Get user by username
async function getUserByUsername(username) {
  try {
    const usersData = await readUsersFile();
    return usersData[username];
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to get user');
  }
}

// Validate user credentials with bcrypt and return JWT if valid
async function validateUser(username, password) {
  try {
    const usersData = await readUsersFile();
    const user = usersData[username];
    
    if (!user) {
      return null;
    }
    
    // If passwords are stored as plain text in your users.json, you might need to 
    // update them to hashed versions first time user logs in
    if (!user.password.startsWith('$2b$')) {
      // This is a plain text password that needs to be hashed
      const hashedPassword = await bcrypt.hash(user.password, 10);
      usersData[username].password = hashedPassword;
      await fs.writeFile(config.USERS_FILE, JSON.stringify(usersData, null, 2));
      
      // Compare the plaintext password with itself for first login
      if (password !== user.password) {
        return null;
      }
    } else {
      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    return {
      username: user.username,
      role: user.role,
      token
    };
  } catch (error) {
    console.error('Error validating user:', error);
    throw new Error('Failed to validate user');
  }
}

// Create a new user with hashed password
async function createUser(username, password, role = 'user') {
  try {
    const usersData = await readUsersFile();
    
    // Check if user already exists
    if (usersData[username]) {
      throw new Error('Username already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Add new user
    usersData[username] = {
      username,
      password: hashedPassword,
      role
    };
    
    // Save users data
    await fs.writeFile(config.USERS_FILE, JSON.stringify(usersData, null, 2));
    
    return { username, role };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Read users file
async function readUsersFile() {
  try {
    const data = await fs.readFile(config.USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    throw new Error('Failed to read users data');
  }
}

module.exports = {
  getUserByUsername,
  validateUser,
  createUser
};