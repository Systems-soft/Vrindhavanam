// src/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authorize = require('../middleware/authorize');

// List customers with pagination, search, filters – requires manageCustomers permission
router.get('/', authorize('manageCustomers'), customerController.list);

// Get single customer – requires viewCustomers permission
router.get('/:id', authorize('viewCustomers'), customerController.get);

// Create new customer – requires manageCustomers permission
router.post('/', authorize('manageCustomers'), customerController.create);

// Update customer – requires editCustomers permission
router.put('/:id', authorize('editCustomers'), customerController.update);

// Delete (deactivate) customer – requires deleteCustomers permission
router.delete('/:id', authorize('deleteCustomers'), customerController.delete);

// Add address to customer – requires manageCustomers permission
router.post('/:id/addresses', authorize('manageCustomers'), customerController.addAddress);

// Export customers – requires exportCustomers permission
router.get('/export', authorize('exportCustomers'), customerController.export);

module.exports = router;
