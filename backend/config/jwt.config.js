// config/jwt.config.js
// In production, these would be loaded from environment variables

module.exports = {
    // JWT secret key (in production, use environment variable)
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    
    // JWT options
    JWT_OPTIONS: {
      expiresIn: '1h',  // Token expiration time
      issuer: 'work-clock-app'  // Token issuer
    }
  };