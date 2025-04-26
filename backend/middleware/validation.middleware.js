// middleware/validation.middleware.js

/**
 * Validate login request
 */
const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required',
        code: 'missing_credentials'
      });
    }
    
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        error: 'Username and password must be strings',
        code: 'invalid_type'
      });
    }
    
    next();
  };
  
  /**
   * Validate record type
   */
  const validateRecordType = (req, res, next) => {
    const { type } = req.body;
    
    if (!type) {
      return res.status(400).json({ 
        error: 'Record type is required',
        code: 'missing_type'
      });
    }
    
    if (type !== 'entry' && type !== 'exit') {
      return res.status(400).json({ 
        error: 'Record type must be either "entry" or "exit"',
        code: 'invalid_type'
      });
    }
    
    next();
  };
  
  /**
   * Validate record update
   */
  const validateRecordUpdate = (req, res, next) => {
    const { type, timestamp } = req.body;
    
    if (!type || !timestamp) {
      return res.status(400).json({ 
        error: 'Record type and timestamp are required',
        code: 'missing_fields'
      });
    }
    
    if (type !== 'entry' && type !== 'exit') {
      return res.status(400).json({ 
        error: 'Record type must be either "entry" or "exit"',
        code: 'invalid_type'
      });
    }
    
    // Validate ISO date format
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,7})?(Z|[+-]\d{2}:\d{2})?$/;
    if (!isoDateRegex.test(timestamp)) {
      return res.status(400).json({ 
        error: 'Timestamp must be in ISO format',
        code: 'invalid_timestamp_format'
      });
    }
    
    // Check if timestamp is a valid date
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid timestamp',
        code: 'invalid_timestamp'
      });
    }
    
    next();
  };
  
  /**
   * Validate ID parameters
   */
  const validateIdParams = (req, res, next) => {
    const { username, index } = req.params;
    
    if (!username) {
      return res.status(400).json({ 
        error: 'Username parameter is required',
        code: 'missing_username'
      });
    }
    
    if (!index || isNaN(parseInt(index))) {
      return res.status(400).json({ 
        error: 'Index parameter must be a valid number',
        code: 'invalid_index'
      });
    }
    
    // Convert index parameter to number
    req.params.index = parseInt(index);
    
    next();
  };
  
  module.exports = {
    validateLogin,
    validateRecordType,
    validateRecordUpdate,
    validateIdParams
  };