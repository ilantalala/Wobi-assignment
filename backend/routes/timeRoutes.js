const express = require('express');
const router = express.Router();
const timeController = require('../controllers/timeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Time-related routes with JWT protection
router.get('/current-time', verifyToken, timeController.getCurrentTime);

module.exports = router;