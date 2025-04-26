// models/user.model.js
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const { USERS_FILE } = require('../config/app.config');

/**
 * Find user by username
 * @param {string} username - The username to search for
 * @returns {Promise<Object|null>} - User object or null if not found
 */
const findByUsername = async (username) => {
  try {
    const users = await readUsersFile();
    if(!users){
      console.log(`This is users: ${users}`)
    } 
    return users[username] || null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};

/**
 * Read and parse users file
 * @returns {Promise<Object>} - Object with users data
 */
const readUsersFile = async () => {
  try {
    await fs.access(USERS_FILE);
  } catch (error) {
    console.log('File does not exist, creating default users');
    await createDefaultUsers();
  }
  const data = await fs.readFile(USERS_FILE, 'utf8');
  const parsedUsers = JSON.parse(data);
  return parsedUsers;
};

/**
 * Create default users with encrypted passwords
 */
const createDefaultUsers = async () => {
  const defaultUsers = {
    admin: {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    },
    user1: {
      username: 'user1',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    },
    user2: {
      username: 'user2',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    },
    popo: {
      username: 'popo',
      password: await bcrypt.hash('popo123', 10),
      role: 'user'
    }
  };
  
  await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  return defaultUsers;
};

/**
 * Update user
 * @param {string} username - Username to update
 * @param {Object} userData - New user data
 * @returns {Promise<Object>} - Updated user object
 */
const updateUser = async (username, userData) => {
  try {
    const users = await readUsersFile();
    
    // Check if user exists
    if (!users[username]) {
      throw new Error('User not found');
    }
    
    // If updating password, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    // Update user data
    users[username] = {
      ...users[username],
      ...userData
    };
    
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    return users[username];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = {
  findByUsername,
  readUsersFile,
  updateUser
};