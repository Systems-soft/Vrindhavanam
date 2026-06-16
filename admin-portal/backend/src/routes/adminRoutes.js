const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard/stats', adminController.stats);
router.get('/dashboard/charts', adminController.charts);
router.get('/products', adminController.products);
router.get('/orders', adminController.orders);
router.get('/customers', adminController.customers);

module.exports = router;
