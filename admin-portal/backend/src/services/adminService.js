const repository = require('../repositories/adminRepository');

module.exports = {
  getDashboardStats: () => repository.getDashboardStats(),
  getDashboardCharts: () => repository.getDashboardCharts(),
  listProducts: () => repository.listProducts(),
  listOrders: () => repository.listOrders(),
  listCustomers: () => repository.listCustomers(),
};
