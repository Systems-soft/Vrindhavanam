// src/services/reportService.js
const pool = require('../config/db');

module.exports = {
  // Sales report: total revenue per day for the last 30 days
  async getSalesReport() {
    const [rows] = await pool.query(
      `SELECT DATE(created_at) as date, SUM(total_amount) as revenue
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );
    return rows;
  },

  // Customer report: count of customers by status
  async getCustomerReport() {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM customers
       GROUP BY status`
    );
    return rows;
  },

  // Order report: count of orders by status
  async getOrderReport() {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM orders
       GROUP BY status`
    );
    return rows;
  }
};
