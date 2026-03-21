const express = require('express');
const { createReview, getProductReviews } = require('../controllers/review.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
