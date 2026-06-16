const pool = require('../config/db');

class Customer {
  static async findAll(filters = {}, pagination = { limit: 25, offset: 0 }) {
    const where = [];
    const params = [];
    if (filters.search) {
      where.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      const like = `%${filters.search}%`;
      params.push(like, like, like);
    }
    // Additional filters can be added here
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT * FROM customers ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(pagination.limit, pagination.offset);
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'country', 'pincode', 'customer_status'];
    const placeholders = fields.map(() => '?').join(',');
    const sql = `INSERT INTO customers (${fields.join(',')}, created_at, created_by) VALUES (${placeholders}, NOW(), ?)`;
    const params = fields.map(f => data[f]);
    params.push(data.created_by || 0);
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

  static async update(id, data, updated_by) {
    const fields = [];
    const params = [];
    for (const key of Object.keys(data)) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
    fields.push('updated_at = NOW()', 'updated_by = ?');
    params.push(updated_by);
    const sql = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Customer;
