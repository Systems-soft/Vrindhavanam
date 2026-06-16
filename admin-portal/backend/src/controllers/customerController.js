// src/controllers/customerController.js
const customerService = require('../services/customerService');
const { validateCustomer, validateAddress } = require('../utils/validation');
const { paginate } = require('../utils/pagination');

module.exports = {
  // GET /api/customers
  async list(req, res) {
    try {
      const data = await customerService.list(req.query);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/customers/:id
  async get(req, res) {
    try {
      const customer = await customerService.get(req.params.id);
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/customers
  async create(req, res) {
    try {
      const { error } = validateCustomer(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      const newCustomer = await customerService.create(req.body);
      res.status(201).json(newCustomer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/customers/:id
  async update(req, res) {
    try {
      const { error } = validateCustomer(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      const updated = await customerService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Customer not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/customers/:id
  async delete(req, res) {
    try {
      const success = await customerService.delete(req.params.id);
      if (!success) return res.status(404).json({ message: 'Customer not found' });
      res.json({ message: 'Customer deactivated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/customers/:id/addresses
  async addAddress(req, res) {
    try {
      const { error } = validateAddress(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      const address = await customerService.addAddress(req.params.id, req.body);
      res.status(201).json(address);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/customers/export
  async export(req, res) {
    try {
      const rows = await customerService.exportAll();
      // For simplicity return JSON; front‑end can convert to CSV/Excel/PDF using utils/export.js
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
