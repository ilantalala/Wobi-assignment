const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Attendance routes - all protected with JWT
router.get('/time-records', verifyToken, attendanceController.getAllRecords);
router.post('/time-record', verifyToken, attendanceController.createRecord);
router.put('/time-records/:username/:index', verifyToken, attendanceController.updateRecord);
router.delete('/time-records/:username/:index', verifyToken, attendanceController.deleteRecord);

// Statistics route - admin only
router.get('/statistics', verifyToken, isAdmin, attendanceController.getStatistics);

module.exports = router;