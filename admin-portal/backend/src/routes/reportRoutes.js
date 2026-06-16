// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authorize = require('../middleware/authorize');

// Sales report – requires analytics view permission
router.get('/sales', authorize('viewAnalytics'), reportController.getSales);

// Customer report – requires analytics view permission
router.get('/customers', authorize('viewAnalytics'), reportController.getCustomers);

// Order report – requires analytics view permission
router.get('/orders', authorize('viewAnalytics'), reportController.getOrders);

module.exports = router;
