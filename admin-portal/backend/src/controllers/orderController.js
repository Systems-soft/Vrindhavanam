// src/controllers/orderController.js
const orderService = require('../services/orderService');
const { validateOrder } = require('../utils/validation'); // assume order schema exists in validation

module.exports = {
  // GET /api/orders
  async list(req, res) {
    try {
      const data = await orderService.list(req.query);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/orders/:id
  async get(req, res) {
    try {
      const order = await orderService.get(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/orders
  async create(req, res) {
    try {
      const { error } = validateOrder(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      const result = await orderService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PATCH /api/orders/:id/status
  async changeStatus(req, res) {
    try {
      const { status, changedBy } = req.body;
      if (!status) return res.status(400).json({ error: 'Missing status field' });
      const updated = await orderService.changeStatus(req.params.id, status, changedBy);
      if (!updated) return res.status(404).json({ message: 'Order not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/orders/:id (cancel)
  async cancel(req, res) {
    try {
      const success = await orderService.cancel(req.params.id);
      if (!success) return res.status(400).json({ message: 'Cannot cancel order' });
      res.json({ message: 'Order cancelled' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/orders/:id/invoice
  async invoice(req, res) {
    try {
      const pdfBuffer = await orderService.generateInvoice(req.params.id);
      if (!pdfBuffer) return res.status(404).json({ message: 'Order not found' });
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/orders/export
  async export(req, res) {
    try {
      const rows = await orderService.exportAll();
      // Return JSON – client can convert using utils/export if needed
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
