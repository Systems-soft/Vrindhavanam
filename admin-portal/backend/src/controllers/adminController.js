const adminService = require('../services/adminService');

async function handle(res, fn) {
  try {
    const data = await fn();
    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  stats: (req, res) => handle(res, () => adminService.getDashboardStats()),
  charts: (req, res) => handle(res, () => adminService.getDashboardCharts()),
  products: (req, res) => handle(res, () => adminService.listProducts()),
  orders: (req, res) => handle(res, () => adminService.listOrders()),
  customers: (req, res) => handle(res, () => adminService.listCustomers()),
};
