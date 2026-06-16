// src/controllers/reportController.js
const reportService = require('../services/reportService');

/**
 * GET /api/reports/sales
 * Returns sales report data (revenue per day).
 */
async function getSales(req, res) {
  try {
    const data = await reportService.getSalesReport();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Report getSales error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sales report' });
  }
}

/**
 * GET /api/reports/customers
 * Returns customer status counts.
 */
async function getCustomers(req, res) {
  try {
    const data = await reportService.getCustomerReport();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Report getCustomers error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customer report' });
  }
}

/**
 * GET /api/reports/orders
 * Returns order status counts.
 */
async function getOrders(req, res) {
  try {
    const data = await reportService.getOrderReport();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Report getOrders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order report' });
  }
}

module.exports = { getSales, getCustomers, getOrders };
