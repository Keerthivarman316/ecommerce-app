const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: BigInt(userId) },
            include: { items: { include: { product: true } } }
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: BigInt(userId) },
                include: { items: { include: { product: true } } }
            });
        }

        const serializedItems = wishlist.items.map(item => ({
            wishlistId: item.wishlistId.toString(),
            productId: item.productId.toString(),
            product: {
                ...item.product,
                id: item.product.id.toString(),
                price: Number(item.product.price)
            }
        }));

        res.json({ id: wishlist.id.toString(), items: serializedItems });
    } catch (error) {
        console.error('Wishlist fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
};

const toggleWishlistItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        let wishlist = await prisma.wishlist.findUnique({ where: { userId: BigInt(userId) } });
        if (!wishlist) {
            wishlist = await prisma.wishlist.create({ data: { userId: BigInt(userId) } });
        }

        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId: BigInt(productId)
                }
            }
        });

        if (existingItem) {
            await prisma.wishlistItem.delete({
                where: { wishlistId_productId: { wishlistId: wishlist.id, productId: BigInt(productId) } }
            });
            return res.json({ message: 'Removed from wishlist' });
        } else {
            await prisma.wishlistItem.create({
                data: { wishlistId: wishlist.id, productId: BigInt(productId) }
            });
            return res.json({ message: 'Added to wishlist' });
        }
    } catch (error) {
        console.error('Wishlist update error:', error);
        res.status(500).json({ message: 'Failed to update wishlist' });
    }
};

module.exports = { getWishlist, toggleWishlistItem };
