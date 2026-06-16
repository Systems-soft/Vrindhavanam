// src/services/customerService.js
const pool = require('../config/db');
const { buildSearchConditions } = require('../utils/search');
const { paginate } = require('../utils/pagination');

module.exports = {
  async list({ page = 1, limit = 25, search, status, tag }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    if (search) {
      const { clause, values } = buildSearchConditions(search, ['first_name', 'last_name', 'email', 'phone']);
      conditions.push(clause);
      params.push(...values);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (tag) {
      conditions.push(`id IN (SELECT customer_id FROM customer_tag_map JOIN tags ON tags.id = customer_tag_map.tag_id WHERE tags.name = ?)`);
      params.push(tag);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const [rows] = await pool.query(`SELECT * FROM customers ${where} ORDER BY created_at DESC LIMIT ?, ?`, [...params, offset, limit]);
    const [{ total }] = await pool.query(`SELECT COUNT(*) AS total FROM customers ${where}`, params);
    return paginate({ data: rows, total, page, limit });
  },

  async get(id) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (!rows.length) return null;
    const customer = rows[0];
    const [addresses] = await pool.query('SELECT * FROM customer_addresses WHERE customer_id = ?', [id]);
    const [tags] = await pool.query(`SELECT t.* FROM tags t JOIN customer_tag_map ctm ON ctm.tag_id = t.id WHERE ctm.customer_id = ?`, [id]);
    const [notes] = await pool.query('SELECT * FROM customer_notes WHERE customer_id = ?', [id]);
    const [orders] = await pool.query('SELECT * FROM orders WHERE customer_id = ?', [id]);
    const [{ ltv }] = await pool.query('SELECT COALESCE(SUM(total_amount),0) AS ltv FROM orders WHERE customer_id = ?', [id]);
    customer.addresses = addresses;
    customer.tags = tags;
    customer.notes = notes;
    customer.orders = orders;
    customer.lifetimeValue = ltv;
    return customer;
  },

  async create(data) {
    const { first_name, last_name, email, phone, status = 'active' } = data;
    const [{ insertId }] = await pool.query(
      'INSERT INTO customers (first_name,last_name,email,phone,status) VALUES (?,?,?,?,?)',
      [first_name, last_name, email, phone, status]
    );
    return { id: insertId, ...data };
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`);
      params.push(v);
    }
    if (!fields.length) return null;
    params.push(id);
    await pool.query(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.get(id);
  },

  async delete(id) {
    const [{ affectedRows }] = await pool.query('UPDATE customers SET status = ? WHERE id = ?', ['inactive', id]);
    return affectedRows > 0;
  },

  // Address helpers
  async addAddress(customerId, addr) {
    const { address, city, state, country, pincode, is_default_shipping = false, is_default_billing = false } = addr;
    const [{ insertId }] = await pool.query(
      `INSERT INTO customer_addresses (customer_id, address, city, state, country, pincode, is_default_shipping, is_default_billing)
       VALUES (?,?,?,?,?,?,?,?)`,
      [customerId, address, city, state, country, pincode, is_default_shipping, is_default_billing]
    );
    return { id: insertId, ...addr, customer_id: customerId };
  },

  // Tag helpers
  async addTag(customerId, tagName) {
    const [{ id: existingId }] = await pool.query('SELECT id FROM tags WHERE name = ?', [tagName]).then(r=>r.length?{id:r[0].id}:{id:null});
    let tagId = existingId;
    if (!tagId) {
      const [{ insertId }] = await pool.query('INSERT INTO tags (name) VALUES (?)', [tagName]);
      tagId = insertId;
    }
    await pool.query('INSERT IGNORE INTO customer_tag_map (customer_id, tag_id) VALUES (?,?)', [customerId, tagId]);
    return { tagId, tagName };
  },

  // Note helpers
  async addNote(customerId, { note }) {
    const [{ insertId }] = await pool.query('INSERT INTO customer_notes (customer_id, note) VALUES (?,?)', [customerId, note]);
    return { id: insertId, note };
  },

  // Export all customers
  async exportAll() {
    const [rows] = await pool.query('SELECT * FROM customers');
    return rows;
  }
};
