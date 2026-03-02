const express = require('express');
const { checkout, getUserOrders } = require('../controllers/order.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticateToken);
router.post('/checkout', checkout);
router.get('/', getUserOrders);
module.exports = router;    