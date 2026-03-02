const express = require('express');
const {
    getCart,
    addItemToCart,
    removeItemFromCart
} = require('../controllers/cart.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticateToken);
router.get('/', getCart);
router.post('/items', addItemToCart);
router.delete('/items/:productId', removeItemFromCart);
module.exports = router;