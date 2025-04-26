// models/record.model.js
const fs = require('fs').promises;
const { TIME_RECORDS_FILE } = require('../config/app.config');

/**
 * Get all time records
 * @returns {Promise<Object>} Object with user records
 */
const getAllRecords = async () => {
  try {
    await fs.access(TIME_RECORDS_FILE);
  } catch {
    // Create empty records file if it doesn't exist
    await fs.writeFile(TIME_RECORDS_FILE, '{}');
  }
  
  const data = await fs.readFile(TIME_RECORDS_FILE, 'utf8');
  return JSON.parse(data);
};

/**
 * Get records for a specific user
 * @param {string} username - Username
 * @returns {Promise<Array>} Array of user's records
 */
const getUserRecords = async (username) => {
  const records = await getAllRecords();
  return records[username] || [];
};

/**
 * Add a new record for a user
 * @param {string} username - Username
 * @param {Object} record - Record to add
 * @returns {Promise<Object>} Added record
 */
const addRecord = async (username, record) => {
  const records = await getAllRecords();
  
  // Initialize user records array if it doesn't exist
  if (!records[username]) {
    records[username] = [];
  }
  
  // Add the new record
  records[username].push(record);
  
  // Save to file
  await fs.writeFile(TIME_RECORDS_FILE, JSON.stringify(records, null, 2));
  
  return record;
};

/**
 * Update a record
 * @param {string} username - Username
 * @param {number} index - Record index
 * @param {Object} updatedRecord - New record data
 * @returns {Promise<Object>} Result with success status
 */
const updateRecord = async (username, index, updatedRecord) => {
  const records = await getAllRecords();
  
  // Check if record exists
  if (!records[username] || !records[username][index]) {
    return { success: false };
  }
  
  // Update the record
  records[username][index] = {
    type: updatedRecord.type,
    timestamp: updatedRecord.timestamp
  };
  
  // Save to file
  await fs.writeFile(TIME_RECORDS_FILE, JSON.stringify(records, null, 2));
  
  return { 
    success: true,
    record: records[username][index]
  };
};

/**
 * Delete a record
 * @param {string} username - Username
 * @param {number} index - Record index
 * @returns {Promise<Object>} Result with success status
 */
const deleteRecord = async (username, index) => {
  const records = await getAllRecords();
  
  // Check if record exists
  if (!records[username] || !records[username][index]) {
    return { success: false };
  }
  
  // Remove the record
  records[username].splice(index, 1);
  
  // Save to file
  await fs.writeFile(TIME_RECORDS_FILE, JSON.stringify(records, null, 2));
  
  return { success: true };
};

module.exports = {
  getAllRecords,
  getUserRecords,
  addRecord,
  updateRecord,
  deleteRecord
};