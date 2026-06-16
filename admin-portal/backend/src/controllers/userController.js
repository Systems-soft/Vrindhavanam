// src/controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { getUserPermissions } = require('../utils/permission');

// Get own profile
exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.execute('SELECT id, email, role, created_at FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
  return res.json(rows[0]);
};

// Update own profile (email, password)
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { email, password } = req.body;
  const fields = [];
  const values = [];
  if (email) { fields.push('email = ?'); values.push(email); }
  if (password) { const hash = await bcrypt.hash(password, 12); fields.push('password_hash = ?'); values.push(hash); }
  if (fields.length === 0) return res.status(400).json({ message: 'Nothing to update' });
  values.push(userId);
  await db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return res.json({ message: 'Profile updated' });
};

// Admin: list users (paginated)
exports.listUsers = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (page - 1) * limit;
  let sql = 'SELECT id, email, role, created_at FROM users';
  const params = [];
  if (search) { sql += ' WHERE email LIKE ?'; params.push(`%${search}%`); }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  const [rows] = await db.execute(sql, params);
  return res.json({ page, limit, data: rows });
};

// Admin: change user role
exports.changeRole = async (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role) return res.status(400).json({ message: 'userId and role required' });
  await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
  return res.json({ message: 'User role updated' });
};

module.exports = { getProfile, updateProfile, listUsers, changeRole };
