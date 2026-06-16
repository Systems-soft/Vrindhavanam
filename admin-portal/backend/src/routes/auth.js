// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login – returns access & refresh tokens
router.post('/login', authController.login);

// Refresh token – returns new access token
router.post('/refresh', authController.refreshToken);

// Logout – client should discard tokens (optional blacklist logic)
router.post('/logout', authController.logout);

// Forgot password – send reset link
router.post('/forgot', authController.forgotPassword);

// Reset password – verify token & set new password
router.post('/reset', authController.resetPassword);

module.exports = router;
