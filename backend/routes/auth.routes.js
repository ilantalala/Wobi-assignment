// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../middleware/validation.middleware');

// POST /api/auth/login - User login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/verify - Verify token
router.post('/verify', authController.verifyToken);

module.exports = router;