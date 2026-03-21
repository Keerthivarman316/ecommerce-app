const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRecommendations
} = require('../controllers/product.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const { validate, createProductSchema, updateProductSchema } = require('../middleware/validate.middleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getProductById);
router.post('/', authenticateToken, isAdmin, validate(createProductSchema), createProduct);
router.put('/:id', authenticateToken, isAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;