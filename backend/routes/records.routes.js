// routes/records.routes.js
const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/records.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const { validateRecordType, validateRecordUpdate, validateIdParams } = require('../middleware/validation.middleware');

// GET /api/records - Get all records (admin) or user's records
router.get('/', authenticateToken, recordsController.getAllRecords);

// POST /api/records - Create a new time record
router.post('/', authenticateToken, validateRecordType, recordsController.createRecord);

// GET /api/records/time - Get current time (Germany)
router.get('/time', recordsController.getCurrentTime);

// PUT /api/records/:username/:index - Update a record (admin only)
router.put('/:username/:index', authenticateToken, isAdmin, validateIdParams, validateRecordUpdate, 
  recordsController.updateRecord);

// DELETE /api/records/:username/:index - Delete a record (admin only)
router.delete('/:username/:index', authenticateToken, isAdmin, validateIdParams, 
  recordsController.deleteRecord);

module.exports = router;