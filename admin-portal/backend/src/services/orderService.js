// src/services/orderService.js
const pool = require('../config/db');
const { buildSearchConditions } = require('../utils/search');
const { paginate } = require('../utils/pagination');

module.exports = {
  // List orders with pagination, search, and status filter
  async list({ page = 1, limit = 25, search, status }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    if (search) {
      const { clause, values } = buildSearchConditions(search, ['id', 'total_amount']);
      conditions.push(clause);
      params.push(...values);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const [rows] = await pool.query(
  `SELECT * FROM orders ${where}
   ORDER BY placed_at DESC
   LIMIT ?, ?`, [...params, offset, limit]);
    const [{ total }] = await pool.query(`SELECT COUNT(*) AS total FROM orders ${where}`, params);
    return paginate({ data: rows, total, page, limit });
  },

  // Get a single order with its items and status history
  async get(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!rows.length) return null;
    const order = rows[0];
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    const [history] = await pool.query('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY changed_at DESC', [id]);
    order.items = items;
    order.history = history;
    return order;
  },

  // Create a new order (basic implementation – expects items array)
  async create({ customer_id, total_amount, items }) {
    const [{ insertId: orderId }] = await pool.query(
      'INSERT INTO orders (customer_id, total_amount, status) VALUES (?,?,?)',
      [customer_id, total_amount, 'Pending']
    );
    // Insert items
    if (Array.isArray(items) && items.length) {
      const values = items.map(i => [orderId, i.product_id, i.quantity, i.unit_price]);
      await pool.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?', [values]);
    }
    // Initial status history entry
    await pool.query(
      'INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, changed_by) VALUES (?,?,?,?,?)',
      [orderId, null, 'Pending', new Date(), 'system']
    );
    return { id: orderId };
  },

  // Change status and record history
  async changeStatus(id, newStatus, changedBy = 'system') {
    const [[order]] = await pool.query('SELECT status FROM orders WHERE id = ?', [id]);
    if (!order) return null;
    const oldStatus = order.status;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, id]);
    await pool.query(
      'INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, changed_by) VALUES (?,?,?,?,?)',
      [id, oldStatus, newStatus, new Date(), changedBy]
    );
    return this.get(id);
  },

  // Cancel an order (sets status to Cancelled if allowed)
  async cancel(id) {
    // Only allow cancellation from Pending state
    const [[order]] = await pool.query('SELECT status FROM orders WHERE id = ?', [id]);
    if (!order || order.status !== 'Pending') return false;
    await this.changeStatus(id, 'Cancelled');
    return true;
  },

  // Generate a simple PDF invoice (uses pdfkit)
  async generateInvoice(id) {
    const order = await this.get(id);
    if (!order) return null;
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {});
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Customer ID: ${order.customer_id}`);
    doc.text(`Total Amount: $${order.total_amount}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();
    doc.text('Items:');
    order.items.forEach(item => {
      doc.text(`- Product ${item.product_id}: ${item.quantity} × $${item.unit_price}`);
    });
    doc.end();
    return Buffer.concat(chunks);
  },

  // Export all orders (raw data for CSV/Excel later)
  async exportAll() {
    const [rows] = await pool.query('SELECT * FROM orders');
    return rows;
  }
};
