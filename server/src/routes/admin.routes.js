const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Apply protection to all admin routes
router.use(authenticateToken);
router.use(isAdmin);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);

// Order Management
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Dashboard Stats
router.get('/stats', adminController.getStats);

module.exports = router;
