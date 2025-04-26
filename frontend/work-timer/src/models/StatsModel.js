// src/models/StatsModel.js
// Handles API calls related to statistics

import AuthModel from './AuthModel';

const API_URL = 'http://localhost:3001/api';

class StatsModel {
  /**
   * Get statistics for current user or all users (admin)
   * @returns {Promise<Object>} - Statistics object
   */
  static async getStatistics() {
    try {
      const response = await fetch(`${API_URL}/stats`, {
        headers: AuthModel.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
}

export default StatsModel;