// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authorize = require('../middleware/authorize');

// List all orders
router.get('/', authorize('viewOrders'), orderController.list);

// Get order by ID
router.get('/:id', authorize('viewOrders'), orderController.get);

// Create new order
router.post('/', authorize('manageOrders'), orderController.create);

// Change order status
router.patch('/:id/status', authorize('manageOrders'), orderController.changeStatus);

// Cancel order
router.delete('/:id', authorize('manageOrders'), orderController.cancel);

// Export orders
router.get('/export', authorize('viewOrders'), orderController.export);

module.exports = router;
