const path = require('path');

module.exports = {
  PORT: 3001,
  USERS_FILE: path.join(__dirname, '..', 'data', 'users.json'),
  TIME_RECORDS_FILE: path.join(__dirname, '..', 'data', 'attendance.json'),
};