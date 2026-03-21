const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart items are missing in payload.' });
        }

        let total = 0;
        const orderItems = [];

        // Validate products and calculate exact total from DB pricing to prevent spoofing
        for (const item of items) {
            if (!item.productId || isNaN(Number(item.productId))) {
                return res.status(400).json({ message: `Invalid Product Architecture: Unrecognized signature (${item.productId}). Please clear your cart and re-select database valid components.` });
            }

            const product = await prisma.product.findUnique({ where: { id: BigInt(item.productId) } });

            if (!product) return res.status(404).json({ message: `Product ${item.productId} lost to the void.` });
            if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.productName}.` });

            const itemTotal = Number(product.price) * Number(item.quantity);
            total += itemTotal;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
        }

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate gateway

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
            // Safely decrement stock 
            ...orderItems.map(oi => prisma.product.update({
                where: { id: oi.productId },
                data: { stock: { decrement: oi.quantity } }
            }))
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