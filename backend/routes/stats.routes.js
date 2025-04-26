// routes/stats.routes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/stats - Get statistics for all users or current user
router.get('/', authenticateToken, statsController.getStatistics);

module.exports = router;