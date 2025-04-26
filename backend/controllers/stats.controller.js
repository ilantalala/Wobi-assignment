// controllers/stats.controller.js
const recordModel = require('../models/record.model');
const { calculateUserStats } = require('../utils/statsUtils');

/**
 * Get statistics for all users or the current user
 */
const getStatistics = async (req, res) => {
  try {
    const records = await recordModel.getAllRecords();
    const statistics = {};

    // If not admin, return only the user's statistics
    if (req.user.role !== 'admin') {
      const username = req.user.username;
      if (records[username]) {
        statistics[username] = calculateUserStats(records[username], username);
      }
    } else {
      // For admin, calculate statistics for all users
      for (const [username, userRecords] of Object.entries(records)) {
        statistics[username] = calculateUserStats(userRecords, username);
      }
    }

    // If no statistics, return a message
    if (Object.keys(statistics).length === 0) {
      return res.json({ message: "No statistics available" });
    }

    res.json(statistics);
  } catch (error) {
    console.error('Error generating statistics:', error);
    res.status(500).json({ error: 'Failed to generate statistics' });
  }
};

module.exports = {
  getStatistics
};