// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Access token
function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

// Refresh token
function signRefreshToken(payload) {
  return jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshExpiresIn });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshSecret);
}

// Reset password token (short‑lived)
function signResetToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
}

function verifyResetToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = {
  signToken,
  verifyToken,
  signRefreshToken,
  verifyRefreshToken,
  signResetToken,
  verifyResetToken,
};
