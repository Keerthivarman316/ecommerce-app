const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const router = express.Router();
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);
module.exports = router;