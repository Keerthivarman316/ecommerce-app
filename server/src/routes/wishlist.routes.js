const express = require('express');
const { getWishlist, toggleWishlistItem } = require('../controllers/wishlist.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authenticateToken, getWishlist);
router.post('/toggle', authenticateToken, toggleWishlistItem);

module.exports = router;
