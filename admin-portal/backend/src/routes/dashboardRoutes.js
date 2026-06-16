// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authorize = require('../middleware/authorize');

// Dashboard statistics
router.get('/', authorize('accessDashboard'), dashboardController.getStats);

module.exports = router;
