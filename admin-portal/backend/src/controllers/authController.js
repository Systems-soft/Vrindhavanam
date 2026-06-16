// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const email = require('../utils/email');
const db = require('../config/db');

// Helper to find user by email
async function findUserByEmail(emailAddr) {
  const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [emailAddr]);
  return rows[0];
}

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = jwt.signToken({ id: user.id, role: user.role, email: user.email });
  const refreshToken = jwt.signRefreshToken({ id: user.id });
  // Store refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return res.json({ accessToken });
};

// Refresh token endpoint
exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  try {
    const payload = jwt.verifyRefreshToken(token);
    const newAccess = jwt.signToken({ id: payload.id, role: payload.role, email: payload.email });
    return res.json({ accessToken: newAccess });
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Logout – clear refresh cookie
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out' });
};

// Forgot password – generate token and email link
exports.forgotPassword = async (req, res) => {
  const { email: emailAddr } = req.body;
  const user = await findUserByEmail(emailAddr);
  if (!user) return res.status(200).json({ message: 'If the email exists, a reset link was sent' }); // do not reveal existence

  const resetToken = jwt.signResetToken({ id: user.id });
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await email.sendMail({
    to: emailAddr,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
  });
  return res.json({ message: 'Reset link sent' });
};

// Reset password – verify token and set new password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password required' });
  try {
    const payload = jwt.verifyResetToken(token);
    const hash = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, payload.id]);
    return res.json({ message: 'Password updated' });
  } catch (e) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};
