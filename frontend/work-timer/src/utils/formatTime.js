// src/utils/formatTime.js

/**
 * Format a date object or ISO string to a readable string
 * @param {Date|string} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} - Formatted date string
 */
export const formatDateTime = (date, includeSeconds = true) => {
    if (!date) return '';
    
    try {
      // Convert to Date object if string
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      
      // Format parts
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      
      // Format with or without seconds
      if (includeSeconds) {
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
      }
      
      return `${day}.${month}.${year}, ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  };
  
  /**
   * Format minutes to hours and minutes
   * @param {number} minutes - Minutes to format
   * @returns {string} - Formatted time string (HH:MM)
   */
  export const formatMinutesToTime = (minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) {
      return '00:00';
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };
  
  /**
   * Get the month name from a date
   * @param {Date|string} date - Date to get month from
   * @returns {string} - Month name
   */
  export const getMonthName = (date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString('default', { month: 'long' });
    } catch (error) {
      return '';
    }
  };
  
  export default {
    formatDateTime,
    formatMinutesToTime,
    getMonthName
  };