// src/middleware/authenticate.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

/**
 * Middleware to verify JWT and attach user payload to request.
 * If token is missing or invalid, responds with 401.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
