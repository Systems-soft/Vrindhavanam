// src/controllers/dashboardController.js
const dashboardService = require('../services/dashboardService');
const { exportData } = require('../utils/export');

/**
 * GET /api/dashboard
 * Returns aggregated dashboard metrics.
 */
async function getStats(req, res) {
  try {
    const data = await dashboardService.getMetrics();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Dashboard getStats error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard data' });
  }
}

/**
 * GET /api/dashboard/export?format=csv|excel|pdf
 * Exports the same metrics using the requested format.
 */
async function export(req, res) {
  try {
    const data = await dashboardService.getMetrics();
    const format = req.query.format || 'csv';
    const { buffer, mime, filename } = await exportData([data], format, { filename: 'dashboard' });
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('Dashboard export error:', err);
    res.status(500).json({ success: false, message: 'Failed to export dashboard data' });
  }
}

module.exports = { getStats, export };
