const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await prisma.cart.findUnique({ 
            where: { userId: BigInt(userId) },
            include: { items: { include: { product: true } } } 
        });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot proceed to checkout.' });
        }
        let total = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const itemTotal = Number(item.product.price) * Number(item.quantity);
            total += itemTotal;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.product.price
            });
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        const [newOrder] = await prisma.$transaction([
            prisma.order.create({
                data: {
                    userId: BigInt(userId),
                    total: total,
                    status: "PENDING",
                    items: {
                        create: orderItems
                    }
                }
            }),
            prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            })
        ]);
        res.status(201).json({
            message: 'Payment successful! Order placed.',
            orderId: newOrder.id.toString(),
            totalPaid: total
        });
    }
    catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ message: 'Failed to process payment.' });
    }
};
module.exports = { checkout };