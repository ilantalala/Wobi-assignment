const fs = require('fs').promises;
const config = require('../config/config');
const { calculateUserStatistics } = require('../utils/timeUtils');

// Get all attendance records
async function getAllRecords() {
  try {
    return await readAttendanceFile();
  } catch (error) {
    console.error('Error getting records:', error);
    throw new Error('Failed to get records');
  }
}

// Get records for a specific user
async function getUserRecords(username) {
  try {
    const records = await readAttendanceFile();
    return records[username] || [];
  } catch (error) {
    console.error('Error getting user records:', error);
    throw new Error('Failed to get user records');
  }
}

// Add a new attendance record
async function addRecord(username, type, timestamp) {
  try {
    const records = await readAttendanceFile();
    
    if (!records[username]) {
      records[username] = [];
    }
    
    records[username].push({ type, timestamp });
    await saveAttendance(records);
    
    return { success: true };
  } catch (error) {
    console.error('Error adding record:', error);
    throw new Error('Failed to add record');
  }
}

// Update an existing record
async function updateRecord(username, index, updatedRecord) {
  try {
    const records = await readAttendanceFile();
    const recordIndex = parseInt(index);
    
    if (records[username]?.[recordIndex]) {
      const timestamp = new Date(updatedRecord.timestamp);
      timestamp.setHours(timestamp.getHours() + 2);
      
      records[username][recordIndex] = {
        type: updatedRecord.type,
        timestamp: timestamp.toISOString()
      };
      
      await saveAttendance(records);
      return { 
        success: true, 
        updatedRecord: records[username][recordIndex] 
      };
    } else {
      throw new Error('Record not found');
    }
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
}

// Delete an attendance record
async function deleteRecord(username, index) {
  try {
    const records = await readAttendanceFile();
    const recordIndex = parseInt(index);
    
    if (records[username]?.[recordIndex]) {
      records[username].splice(recordIndex, 1);
      await saveAttendance(records);
      return { success: true };
    } else {
      throw new Error('Record not found');
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
}

// Generate statistics for all users
async function generateStatistics() {
  try {
    const records = await readAttendanceFile();
    const statistics = {};

    for (const [username, userRecords] of Object.entries(records)) {
      statistics[username] = await calculateUserStatistics(userRecords);
    }

    return statistics;
  } catch (error) {
    console.error('Error generating statistics:', error);
    throw new Error('Failed to generate statistics');
  }
}

// Read the attendance file
async function readAttendanceFile() {
  try {
    await fs.access(config.TIME_RECORDS_FILE);
  } catch {
    await fs.writeFile(config.TIME_RECORDS_FILE, '{}');
  }
  
  const data = await fs.readFile(config.TIME_RECORDS_FILE, 'utf8');
  return JSON.parse(data);
}

// Save the attendance data
async function saveAttendance(records) {
  await fs.writeFile(config.TIME_RECORDS_FILE, JSON.stringify(records, null, 2));
}

module.exports = {
  getAllRecords,
  getUserRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  generateStatistics
};