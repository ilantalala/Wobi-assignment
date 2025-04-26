// src/controllers/RecordsController.js
import RecordModel from '../models/RecordModel';

class RecordsController {
  /**
   * Get current time
   * @returns {Promise<string>} - Current time
   */
  static async getCurrentTime() {
    try {
      return await RecordModel.getCurrentTime();
    } catch (error) {
      console.error('Error getting current time:', error);
      throw new Error('Failed to get current time');
    }
  }
  
  /**
   * Get user records
   * @returns {Promise<Object>} - User records
   */
  static async getRecords() {
    try {
      return await RecordModel.getRecords();
    } catch (error) {
      console.error('Error getting records:', error);
      throw new Error('Failed to get records');
    }
  }
  
  /**
   * Create a new record
   * @param {string} type - Record type ('entry' or 'exit')
   * @returns {Promise<Object>} - Created record
   */
  static async createRecord(type) {
    try {
      // Validate type
      if (type !== 'entry' && type !== 'exit') {
        throw new Error('Invalid record type');
      }
      
      const result = await RecordModel.createRecord(type);
      return result;
    } catch (error) {
      console.error('Error creating record:', error);
      throw new Error(error.message || 'Failed to create record');
    }
  }
  
  /**
   * Update a record
   * @param {string} username - Username
   * @param {number} index - Record index
   * @param {Object} record - Record data
   * @returns {Promise<Object>} - Updated record
   */
  static async updateRecord(username, index, record) {
    try {
      // Validate record
      if (!record.type || !record.timestamp) {
        throw new Error('Record must have type and timestamp');
      }
      
      if (record.type !== 'entry' && record.type !== 'exit') {
        throw new Error('Record type must be entry or exit');
      }
      
      const result = await RecordModel.updateRecord(username, index, record);
      return result;
    } catch (error) {
      console.error('Error updating record:', error);
      throw new Error(error.message || 'Failed to update record');
    }
  }
  
  /**
   * Delete a record
   * @param {string} username - Username
   * @param {number} index - Record index
   * @returns {Promise<Object>} - Result
   */
  static async deleteRecord(username, index) {
    try {
      const result = await RecordModel.deleteRecord(username, index);
      return result;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw new Error(error.message || 'Failed to delete record');
    }
  }
}

export default RecordsController;