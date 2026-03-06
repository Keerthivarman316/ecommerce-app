const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, category, page = 1, limit = 10 } = req.query;
        const queryOptions = {
            where: {},
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
        };
        if (search) {
            queryOptions.where.productName = {
                contains: search,
                mode: 'insensitive'
            };
        }
        if (minPrice || maxPrice) {
            queryOptions.where.price = {};
            if (minPrice) queryOptions.where.price.gte = parseFloat(minPrice);
            if (maxPrice) queryOptions.where.price.lte = parseFloat(maxPrice);
        }
        const [products, totalItems] = await Promise.all([
            prisma.product.findMany(queryOptions),
            prisma.product.count({ where: queryOptions.where })
        ]);
        const serializedProducts = products.map(product => ({
            ...product,
            id: product.id.toString(),
            price: Number(product.price)
        }));
        res.json({
            products: serializedProducts,
            pagination: {
                totalItems,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    }
    catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id: BigInt(id) } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ ...product, id: product.id.toString(), price: Number(product.price) });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch product by id' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { productName, stock, price } = req.body;
        const product = await prisma.product.create({
            data: {
                productName,
                stock: parseInt(stock),
                price: parseFloat(price)
            }
        });
        res.status(201).json({ ...product, id: product.id.toString(), price: Number(product.price) });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create product' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, stock, price } = req.body;
        const product = await prisma.product.update({
            where: { id: BigInt(id) },
            data: {
                ...(productName && { productName }),
                ...(stock !== undefined && { stock: parseInt(stock) }),
                ...(price !== undefined && { price: parseFloat(price) })
            }
        });
        res.json({ ...product, id: product.id.toString(), price: Number(product.price) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: BigInt(id) } });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};