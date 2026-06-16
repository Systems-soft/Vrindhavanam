// src/config/permissions.js
/**
 * Role‑based permission matrix (extended for Phase 2).
 */
module.exports = {
  "Super Admin": [
    "manageUsers",
    "viewAll",
    "editAll",
    "deleteAll",
    "accessDashboard",
    "manageCustomers",
    "manageOrders",
    "viewAnalytics",
  ],
  Manager: [
    "viewAll",
    "editOrders",
    "editCustomers",
    "accessDashboard",
    "viewAnalytics",
  ],
  "Inventory Staff": [
    "viewInventory",
    "editInventory",
    "accessDashboard",
  ],
  "Support Staff": [
    "viewTickets",
    "respondTickets",
    "accessDashboard",
  ],
  "Marketing Staff": [
    "viewAnalytics",
    "editCampaigns",
    "accessDashboard",
  ],
  // New module permissions
  "Customer Manager": [
    "manageCustomers",
    "viewCustomers",
    "exportCustomers",
  ],
  "Order Manager": [
    "manageOrders",
    "viewOrders",
    "exportOrders",
  ],
};
