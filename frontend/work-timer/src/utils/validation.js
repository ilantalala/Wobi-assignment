// src/utils/validation.js

/**
 * Validate login form
 * @param {string} username - Username to validate
 * @param {string} password - Password to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateLoginForm = (username, password) => {
    if (!username) {
      return 'Username is required';
    }
    
    if (!password) {
      return 'Password is required';
    }
    
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    
    if (password.length < 5) {
      return 'Password must be at least 5 characters';
    }
    
    return null; // Valid
  };
  
  /**
   * Validate a time record
   * @param {Object} record - Record to validate
   * @returns {string|null} - Error message or null if valid
   */
  export const validateRecord = (record) => {
    if (!record) {
      return 'Record is required';
    }
    
    if (!record.type) {
      return 'Record type is required';
    }
    
    if (record.type !== 'entry' && record.type !== 'exit') {
      return 'Record type must be entry or exit';
    }
    
    if (!record.timestamp) {
      return 'Record timestamp is required';
    }
    
    // Check for valid ISO date
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,7})?(Z|[+-]\d{2}:\d{2})?$/;
    if (!dateRegex.test(record.timestamp)) {
      return 'Invalid timestamp format';
    }
    
    return null; // Valid
  };
  
  export default {
    validateLoginForm,
    validateRecord
  };