const { getGermanyTime } = require('../utils/timeUtils');

// Get current time in Germany
async function getCurrentTime(req, res) {
  try {
    const time = await getGermanyTime();
    res.json({ currentTime: time });
  } catch (error) {
    console.error('Error getting time:', error);
    res.status(500).json({ 
      error: 'Could not fetch time', 
      details: error.message 
    });
  }
}

module.exports = {
  getCurrentTime
};