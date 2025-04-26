// utils/statsUtils.js
const { calculateDuration } = require('./timeUtils');

/**
 * Calculate statistics for a user's records
 * @param {Array} records - User's time records
 * @param {string} username - Username
 * @returns {Object} Statistics object
 */
function calculateUserStats(records, username) {
  // Count entries and exits
  const entries = records.filter(r => r.type === 'entry').length;
  const exits = records.filter(r => r.type === 'exit').length;
  
  // Sort records chronologically
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Initialize stay time variables
  let totalStayTime = 0;
  let stayCount = 0;
  let longestStay = 0;
  let shortestStay = Infinity;
  
  // Calculate stay times
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    if (sortedRecords[i].type === 'entry' && sortedRecords[i + 1].type === 'exit') {
      const stayTime = calculateDuration(
        sortedRecords[i].timestamp, 
        sortedRecords[i + 1].timestamp
      );
      
      if (stayTime <= 0) continue; // Skip invalid times
      
      totalStayTime += stayTime;
      longestStay = Math.max(longestStay, stayTime);
      shortestStay = Math.min(shortestStay, stayTime);
      stayCount++;
      i++; // Skip the exit record in the next iteration
    }
  }
  
  // Generate monthly statistics
  const monthlyStats = {};
  records.forEach(record => {
    const date = new Date(record.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = 0;
    }
    
    monthlyStats[monthKey]++;
  });
  
  // Check for imbalance between entries and exits
  const balanceIssue = entries !== exits;
  
  return {
    username,
    totalRecords: records.length,
    entries,
    exits,
    balanceIssue,
    averageStayTime: stayCount > 0 ? Math.round(totalStayTime / stayCount) : 0,
    longestStay: longestStay || 0,
    shortestStay: shortestStay === Infinity ? 0 : shortestStay,
    lastRecord: records.length > 0 ? records[records.length - 1] : null,
    monthlyStats
  };
}

module.exports = {
  calculateUserStats
};