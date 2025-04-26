// src/controllers/StatsController.js
import StatsModel from '../models/StatsModel';

class StatsController {
  /**
   * Get statistics for current user or all users (admin)
   * @returns {Promise<Object>} - Statistics data
   */
  static async getStatistics() {
    try {
      return await StatsModel.getStatistics();
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw new Error('Failed to get statistics');
    }
  }
}

export default StatsController;