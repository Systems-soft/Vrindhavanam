// src/models/Order.js
const pool = require('../config/db');

class Order {
  static async create(orderData) {
    const { customer_id, total_amount, created_by } = orderData;
    const [result] = await pool.execute(
      'INSERT INTO orders (customer_id, total_amount, created_by) VALUES (?,?,?)',
      [customer_id, total_amount, created_by]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll(filters = {}, pagination = { limit: 25, offset: 0 }) {
    const where = [];
    const params = [];
    if (filters.status) {
      where.push('status = ?');
      params.push(filters.status);
    }
    if (filters.search) {
      where.push('id LIKE ?');
      params.push(`%${filters.search}%`);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT * FROM orders ${whereClause} ORDER BY placed_at DESC LIMIT ? OFFSET ?`;
    params.push(pagination.limit, pagination.offset);
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async updateStatus(id, newStatus, changedBy) {
    // Get current status
    const order = await this.findById(id);
    if (!order) throw new Error('Order not found');
    const oldStatus = order.status;
    await pool.execute('UPDATE orders SET status = ?, updated_at = NOW(), updated_by = ? WHERE id = ?', [newStatus, changedBy, id]);
    // Insert into history
    await pool.execute(
      'INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by) VALUES (?,?,?,?)',
      [id, oldStatus, newStatus, changedBy]
    );
    return true;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Order;
