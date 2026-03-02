const { PrismaClient } = require('@prisma/client');
const { get } = require('http');
const prisma = new PrismaClient();

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await prisma.cart.findFirst({
            where: { userId: BigInt(userId) },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: BigInt(userId) },
                include: { items: true }
            });
        }
        res.json({
            id: cart.id.toString(),
            userId: cart.userId.toString(),
            items: cart.items.map(item => ({
                cartId: item.cartId.toString(),
                productId: item.productId.toString(),
                quantity: item.quantity,
                product: {
                    ...item.product,
                    id: item.product.id.toString(),
                    price: Number(item.product.price)
                }
            }))
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch the cart' });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        let cart = await prisma.cart.findFirst({
            where: { userId: BigInt(userId) }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: BigInt(userId) }
            });
        }
        const product = await prisma.product.findUnique({
            where: { id: BigInt(productId) }
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });
        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: BigInt(productId)
                }
            },
            update: {
                quantity: {
                    increment: parseInt(quantity)
                }
            },
            create: {
                cartId: cart.id,
                productId: BigInt(productId),
                quantity: parseInt(quantity)
            },
            include: { product: true }
        });
        res.json({
            cartId: cartItem.cartId.toString(),
            productId: cartItem.productId.toString(),
            quantity: cartItem.quantity,
            product: {
                ...cartItem.product,
                id: cartItem.product.id.toString(),
                price: Number(cartItem.product.price)
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const cart = await prisma.cart.findFirst({
            where: { userId: BigInt(userId) }
        });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: BigInt(productId)
                }
            }
        });
        res.json({ message: 'Item removed from cart' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};
module.exports = {
    getCart,
    addItemToCart,
    removeItemFromCart
};