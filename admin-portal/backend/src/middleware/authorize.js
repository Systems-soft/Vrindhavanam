// src/middleware/authorize.js
const permissions = require('../config/permissions');

/**
 * Middleware to enforce role‑based access control.
 * usage: authorize('manageUsers') – checks if the user's role grants the given permission.
 */
function authorize(requiredPermission) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;
    if (!userRole) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    const rolePermissions = permissions[userRole] || [];
    if (!rolePermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = authorize;
