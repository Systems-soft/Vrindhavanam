// src/utils/pagination.js
/**
 * Helper to calculate offset and limit for pagination.
 * Returns an object { limit, offset } that can be spread into a MySQL query.
 */
function getPagination(page = 1, limit = 25) {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
  const offset = (safePage - 1) * safeLimit;
  return { limit: safeLimit, offset };
}

module.exports = { getPagination };
