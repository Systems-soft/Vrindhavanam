// src/services/dashboardService.js
const pool = require('../config/db');

/**
 * Retrieves aggregated dashboard metrics.
 * Returns an object with revenue, ordersCount, customersCount, inventoryCount,
 * subscriptionsCount, notificationsCount.
 */
async function getMetrics() {
  // Revenue: total of orders in last 30 days
  const [revenueRows] = await pool.query(
    `SELECT SUM(total_amount) AS revenue FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
  );
  const revenue = revenueRows[0].revenue || 0;

  // Orders count (all time)
  const [ordersRows] = await pool.query(`SELECT COUNT(*) AS count FROM orders`);
  const ordersCount = ordersRows[0].count;

  // Customers count
  const [customersRows] = await pool.query(`SELECT COUNT(*) AS count FROM customers`);
  const customersCount = customersRows[0].count;

  // Inventory count (assuming table `inventory` with quantity column)
  const [inventoryRows] = await pool.query(`SELECT SUM(quantity) AS count FROM inventory`);
  const inventoryCount = inventoryRows[0].count || 0;

  // Subscriptions count (table `subscriptions`)
  const [subsRows] = await pool.query(`SELECT COUNT(*) AS count FROM subscriptions`);
  const subscriptionsCount = subsRows[0].count;

  // Notifications count (table `notifications`)
  const [notifRows] = await pool.query(`SELECT COUNT(*) AS count FROM notifications`);
  const notificationsCount = notifRows[0].count;

  return {
    revenue,
    ordersCount,
    customersCount,
    inventoryCount,
    subscriptionsCount,
    notificationsCount,
  };
}

module.exports = { getMetrics };
