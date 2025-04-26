// utils/timeUtils.js

/**
 * Get the current time in Germany
 * @returns {Promise<string>} ISO date string for Germany time
 */
// utils/timeUtils.js
async function getGermanyTime() {
  try {
    // Try to get time from timeapi.io with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout
    
    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Clear the timeout if request completes
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.dateTime) {
      console.log(`Time received from API: ${data.dateTime}`);
      return data.dateTime;
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching time from API:', error);
    console.log('Using fallback time calculation method');
    
    // Fallback method using UTC
    const now = new Date();
    
    // Convert to UTC, then subtract 1 hour for Germany time (UTC+1 or UTC+2 during DST)
    const utcNow = new Date(now.toUTCString());
    
    // Check if Germany is in Daylight Saving Time
    const month = utcNow.getUTCMonth() + 1; // 1-12
    const isDST = month > 3 && month < 11; // Simplified DST check
    
    // Apply the UTC offset: UTC+1 for winter, UTC+2 for summer
    const germanyTime = new Date(utcNow);
    germanyTime.setUTCHours(germanyTime.getUTCHours() + (isDST ? 2 : 1));
    
    console.log(`Fallback Germany time: ${germanyTime.toISOString()}`);
    return germanyTime.toISOString();
  }
}
  
  /**
   * Format date for display
   * @param {string} timestamp - ISO date string
   * @returns {string} Formatted date string
   */
  function formatDisplayDate(timestamp) {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }
  
  /**
   * Calculate duration between two timestamps in minutes
   * @param {string} startTime - ISO start time
   * @param {string} endTime - ISO end time
   * @returns {number} Duration in minutes
   */
  function calculateDuration(startTime, endTime) {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      // Calculate difference in milliseconds
      const diffMs = end - start;
      
      // Convert to minutes
      return Math.floor(diffMs / (1000 * 60));
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 0;
    }
  }
  
  module.exports = {
    getGermanyTime,
    formatDisplayDate,
    calculateDuration
  };