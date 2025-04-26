// controllers/records.controller.js
const recordModel = require('../models/record.model');
const timeUtils = require('../utils/timeUtils');

/**
 * Get all records (admin) or user's records
 */
const getAllRecords = async (req, res) => {
  try {
    const records = await recordModel.getAllRecords();
    
    // If not admin, return only user's records
    if (req.user.role !== 'admin') {
      return res.json({ 
        [req.user.username]: records[req.user.username] || [] 
      });
    }
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

/**
 * Create a new time record
 */
const createRecord = async (req, res) => {
  const { type } = req.body;
  const username = req.user.username;
  
  try {
    const germanyTime = await timeUtils.getGermanyTime();
    const newRecord = { type, timestamp: germanyTime };
    
    await recordModel.addRecord(username, newRecord);
    
    res.json({ success: true, record: newRecord });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Error recording time' });
  }
};

/**
 * Get current time (Germany)
 */
const getCurrentTime = async (req, res) => {
  try {
    const time = await timeUtils.getGermanyTime();
    res.json({ currentTime: time });
  } catch (error) {
    console.error('Error fetching time:', error);
    res.status(500).json({ error: 'Could not fetch time' });
  }
};

/**
 * Update a record (admin only)
 */
const updateRecord = async (req, res) => {
  try {
    const { username, index } = req.params;
    const updatedRecord = req.body;
    
    const result = await recordModel.updateRecord(username, index, updatedRecord);
    
    if (!result.success) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ 
      success: true, 
      updatedRecord: result.record
    });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
};

/**
 * Delete a record (admin only)
 */
const deleteRecord = async (req, res) => {
  try {
    const { username, index } = req.params;
    
    const result = await recordModel.deleteRecord(username, index);
    
    if (!result.success) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
};

module.exports = {
  getAllRecords,
  createRecord,
  getCurrentTime,
  updateRecord,
  deleteRecord
};