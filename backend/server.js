const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Import config
const config = require('./config/config');

const app = express();
const port = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', timeRoutes);
app.use('/api', attendanceRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});