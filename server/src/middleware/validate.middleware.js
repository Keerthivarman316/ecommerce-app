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

module.exports = {
    validate, updateOrderStatusSchema, updateUserRoleSchema, updateProfileSchema
};