const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Convert BigInt to string for JSON serialization
        const serializedUsers = users.map(user => ({
            ...user,
            id: user.id.toString()
        }));

        res.json(serializedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: { role }
        });

        res.json({
            message: 'User role updated successfully',
            user: {
                id: updatedUser.id.toString(),
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const serializedOrders = orders.map(order => ({
            ...order,
            id: order.id.toString(),
            userId: order.userId.toString(),
            items: order.items.map(item => ({
                ...item,
                orderId: item.orderId.toString(),
                productId: item.productId.toString()
            }))
        }));

        res.json(serializedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: BigInt(id) },
            data: { status }
        });

        res.json({
            message: 'Order status updated successfully',
            order: {
                id: updatedOrder.id.toString(),
                status: updatedOrder.status
            }
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

const getStats = async (req, res) => {
    try {
        const [userCount, orderCount, products, orders] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.findMany({
                select: { total: true }
            })
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

        res.json({
            totalUsers: userCount,
            totalOrders: orderCount,
            totalProducts: products,
            totalRevenue: totalRevenue.toFixed(2)
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    getOrders,
    updateOrderStatus,
    getStats
};
