const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkout = async (req, res) => {
    try {
        const userId = req.user.id || req.user.user.id;
        const cart = await prisma.cart.findFirst({
            where: { userId: BigInt(userId) },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
        let total = 0;
        const orderItems = [];
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for ${item.product.productName}` });
            }
            const priceAtPurchase = item.product.price;
            total += Number(priceAtPurchase) * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: priceAtPurchase
            });
        }
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: BigInt(userId),
                    total: total,
                    status: 'PENDING',
                    items: {
                        create: orderItems
                    }
                },
                include: { items: true }
            });
            for (const item of orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
            return newOrder;
        });
        res.status(201).json({
            id: order.id.toString(),
            userId: order.userId.toString(),
            total: Number(order.total),
            status: order.status,
            items: order.items.map(item => ({
                orderId: item.orderId.toString(),
                productId: item.productId.toString(),
                quantity: item.quantity,
                priceAtPurchase: Number(item.priceAtPurchase)
            }))
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to checkout' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id || req.user.user.id;
        const orders = await prisma.order.findMany({
            where: { userId: BigInt(userId) },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const serializedOrders = orders.map(order => ({
            id: order.id.toString(),
            userId: order.userId.toString(),
            total: Number(order.total),
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId.toString(),
                productName: item.product.productName,
                quantity: item.quantity,
                priceAtPurchase: Number(item.priceAtPurchase)
            }))
        }));
        res.json(serializedOrders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { username: true, email: true } },
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' }
        })
        const serializedOrders = orders.map(order => ({
            id: order.id.toString(),
            userId: order.userId.toString(),
            user: order.user,
            total: Number(order.total),
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId.toString(),
                productName: item.product.productName,
                quantity: item.quantity,
                priceAtPurchase: Number(item.priceAtPurchase)
            }))
        }));
        res.json(serializedOrders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid order status' });
        }
        const order = await prisma.order.update({
            where: { id: BigInt(id) },
            data: { status: status }
        });
        res.json({
            id: order.id.toString(),
            status: order.status,
            message: 'Order status updated successfully'
        });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(400).json({ error: 'Order not found' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id || req.user.user.id;
        const { id } = req.params;

        const order = await prisma.order.findUnique({ where: { id: BigInt(id) } });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (order.userId !== BigInt(userId)) {
            return res.status(403).json({ error: 'Unauthorized to modify this order' });
        }

        if (order.status.includes('SHIPPED') || order.status.includes('DELIVERED') || order.status.includes('CANCELLED')) {
            return res.status(400).json({ error: 'Order is locked and cannot be cancelled.' });
        }

        const updated = await prisma.order.update({
            where: { id: BigInt(id) },
            data: { status: 'CANCELLED' }
        });

        res.json({ id: updated.id.toString(), status: updated.status, message: 'Order successfully cancelled!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to abort order' });
    }
}

module.exports = {
    checkout,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};  