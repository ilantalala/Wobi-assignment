// server.js - Main entry point
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { ensureDataDirExists } = require('./config/app.config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const recordsRoutes = require('./routes/records.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const port = process.env.PORT

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/stats', statsRoutes);

// Fallback route for 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Initialize and start the server
async function startServer() {
  try {
    // Initialize data directory
    await ensureDataDirExists();
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

startServer();