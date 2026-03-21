const Joi = require('joi');
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    };
};

const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED').required()
});

const updateUserRoleSchema = Joi.object({
    role: Joi.string().valid('ADMIN', 'USER').required()
});

const updateProfileSchema = Joi.object({
    username: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
}).min(1);

const createProductSchema = Joi.object({
    productName: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    platform: Joi.string().optional(),
    brand: Joi.string().required(),
    performanceTags: Joi.array().items(Joi.string()).optional(),
    gamerRating: Joi.number().min(0).max(10).optional(),
    compatibility: Joi.string().optional(),
    stockUrgency: Joi.string().optional(),
    image: Joi.string().optional(),
    description: Joi.string().optional()
});

const updateProductSchema = Joi.object({
    productName: Joi.string().optional(),
    stock: Joi.number().integer().min(0).optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().optional(),
    platform: Joi.string().optional(),
    brand: Joi.string().optional(),
    performanceTags: Joi.array().items(Joi.string()).optional(),
    gamerRating: Joi.number().min(0).max(10).optional(),
    compatibility: Joi.string().optional(),
    stockUrgency: Joi.string().optional(),
    image: Joi.string().optional(),
    description: Joi.string().optional()
}).min(1);

module.exports = {
    validate, updateOrderStatusSchema, updateUserRoleSchema, updateProfileSchema, createProductSchema, updateProductSchema
};