// src/models/RecordModel.js
// Handles API calls related to time records

import AuthModel from './AuthModel';

const API_URL = 'http://localhost:3001/api';

class RecordModel {
  /**
   * Get current time from server
   * @returns {Promise<string>} - Current time in Germany
   */
  static async getCurrentTime() {
    try {
      const response = await fetch(`${API_URL}/records/time`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time');
      }
      
      const data = await response.json();
      return data.currentTime;
    } catch (error) {
      console.error('Error fetching time:', error);
      throw error;
    }
  }
  
  /**
   * Get all records for current user or admin
   * @returns {Promise<Object>} - Records object
   */
  static async getRecords() {
    try {
      const response = await fetch(`${API_URL}/records`, {
        headers: AuthModel.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  }
  
  /**
   * Create a new time record
   * @param {string} type - Record type ('entry' or 'exit')
   * @returns {Promise<Object>} - Created record
   */
  static async createRecord(type) {
    try {
      const response = await fetch(`${API_URL}/records`, {
        method: 'POST',
        headers: AuthModel.getAuthHeaders(),
        body: JSON.stringify({ type })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create record');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  }
  
  /**
   * Update a time record (admin only)
   * @param {string} username - Username
   * @param {number} index - Record index
   * @param {Object} record - Updated record data
   * @returns {Promise<Object>} - Updated record
   */
  static async updateRecord(username, index, record) {
    try {
      const response = await fetch(`${API_URL}/records/${username}/${index}`, {
        method: 'PUT',
        headers: AuthModel.getAuthHeaders(),
        body: JSON.stringify(record)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update record');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }
  
  /**
   * Delete a time record (admin only)
   * @param {string} username - Username
   * @param {number} index - Record index
   * @returns {Promise<Object>} - Response
   */
  static async deleteRecord(username, index) {
    try {
      const response = await fetch(`${API_URL}/records/${username}/${index}`, {
        method: 'DELETE',
        headers: AuthModel.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }
}

export default RecordModel;