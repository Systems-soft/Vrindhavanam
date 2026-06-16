const pool = require('../config/db');

async function queryOne(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
}

module.exports = {
  async getDashboardStats() {
    const revenueToday = await queryOne(
      "SELECT COALESCE(SUM(total_amount),0) AS value FROM orders WHERE DATE(placed_at) = CURDATE()",
    );
    const revenueMonth = await queryOne(
      "SELECT COALESCE(SUM(total_amount),0) AS value FROM orders WHERE YEAR(placed_at) = YEAR(CURDATE()) AND MONTH(placed_at) = MONTH(CURDATE())",
    );
    const totalOrders = await queryOne("SELECT COUNT(*) AS value FROM orders");
    const pendingOrders = await queryOne("SELECT COUNT(*) AS value FROM orders WHERE status = 'Pending'");
    const deliveredOrders = await queryOne("SELECT COUNT(*) AS value FROM orders WHERE status = 'Delivered'");
    const totalCustomers = await queryOne("SELECT COUNT(*) AS value FROM customers");
    const activeSubscribers = { value: 0 };
    const lowStockProducts = await queryOne(
      "SELECT COUNT(*) AS value FROM products WHERE CAST(COALESCE(stock_status,'') AS CHAR) LIKE '%low%'",
    );
    const outOfStockProducts = await queryOne(
      "SELECT COUNT(*) AS value FROM products WHERE CAST(COALESCE(stock_status,'') AS CHAR) LIKE '%out%'",
    );

    return {
      revenueToday: Number(revenueToday?.value || 0),
      revenueMonth: Number(revenueMonth?.value || 0),
      totalOrders: Number(totalOrders?.value || 0),
      pendingOrders: Number(pendingOrders?.value || 0),
      deliveredOrders: Number(deliveredOrders?.value || 0),
      totalCustomers: Number(totalCustomers?.value || 0),
      activeSubscribers: Number(activeSubscribers?.value || 0),
      lowStockProducts: Number(lowStockProducts?.value || 0),
      outOfStockProducts: Number(outOfStockProducts?.value || 0),
    };
  },

  async getDashboardCharts() {
    const [sales] = await pool.query(
      `SELECT DATE(placed_at) AS label, COALESCE(SUM(total_amount),0) AS value
       FROM orders
       WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(placed_at)
       ORDER BY label ASC`,
    );

    const [customerGrowth] = await pool.query(
      `SELECT DATE(created_at) AS label, COUNT(*) AS value
       FROM customers
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY label ASC`,
    );

    const [productSales] = await pool.query(
      `SELECT product_name AS label, COALESCE(SUM(price),0) AS value
       FROM products
       GROUP BY product_name
       ORDER BY value DESC
       LIMIT 6`,
    );

    return {
      salesTrend: sales,
      customerGrowth,
      productSales,
      subscriptionRevenue: [],
    };
  },

  async listProducts() {
    const [rows] = await pool.query(
      `SELECT id, product_id, product_name, variety_name, weight, daily_price, price, stock_status, image_url
       FROM products
       ORDER BY product_name ASC`,
    );
    return rows;
  },

  async listOrders() {
    const [rows] = await pool.query(
      `SELECT id, customer_id, total_amount, status, placed_at, updated_at
       FROM orders
       ORDER BY placed_at DESC`,
    );
    return rows;
  },

  async listCustomers() {
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, phone, status, created_at
       FROM customers
       ORDER BY created_at DESC`,
    );
    return rows;
  },
};
