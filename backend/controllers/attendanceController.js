const attendanceModel = require('../models/attendanceModel');
const { getGermanyTime } = require('../utils/timeUtils');

// Get all attendance records
async function getAllRecords(req, res) {
  try {
    const records = await attendanceModel.getAllRecords();
    res.json(records);
  } catch (error) {
    console.error('Error getting records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
}

// Create a new attendance record
async function createRecord(req, res) {
  const { username, type } = req.body;
  
  try {
    const germanyTime = await getGermanyTime();
    const result = await attendanceModel.addRecord(username, type, germanyTime);
    res.json(result);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Error recording time' });
  }
}

// Update an existing record
async function updateRecord(req, res) {
  try {
    const { username, index } = req.params;
    const updatedRecord = req.body;
    
    const result = await attendanceModel.updateRecord(username, index, updatedRecord);
    res.json(result);
  } catch (error) {
    console.error('Error updating record:', error);
    if (error.message === 'Record not found') {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.status(500).json({ error: 'Failed to update record' });
    }
  }
}

// Delete an attendance record
async function deleteRecord(req, res) {
  try {
    const { username, index } = req.params;
    
    const result = await attendanceModel.deleteRecord(username, index);
    res.json(result);
  } catch (error) {
    console.error('Error deleting record:', error);
    if (error.message === 'Record not found') {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }
}

// Generate attendance statistics
async function getStatistics(req, res) {
  try {
    const statistics = await attendanceModel.generateStatistics();
    res.json(statistics);
  } catch (error) {
    console.error('Error generating statistics:', error);
    res.status(500).json({ error: 'Failed to generate statistics' });
  }
}

module.exports = {
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getStatistics
};