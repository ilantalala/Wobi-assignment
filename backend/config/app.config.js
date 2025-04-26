// config/app.config.js
const path = require('path');
const fs = require('fs').promises;

// Application configuration
module.exports = {
  // Data storage paths
  DATA_DIR: path.join(__dirname, '..', 'data'),
  USERS_FILE: path.join(__dirname, '..', 'data', 'users.json'),
  TIME_RECORDS_FILE: path.join(__dirname, '..', 'data', 'attendance.json'),
  
  // Ensure data directory exists
  ensureDataDirExists: async () => {
    const dataDir = path.join(__dirname, '..', 'data');
    
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }
};