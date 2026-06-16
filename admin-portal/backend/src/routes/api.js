// src/routes/api.js
const express = require('express');
const router = express.Router();

// Import sub‑routers (these will be created later)
// Placeholder routes – actual implementations will be added in Phase 2
router.get('/', (req, res) => {
  res.json({ message: 'API root' });
});

module.exports = router;
