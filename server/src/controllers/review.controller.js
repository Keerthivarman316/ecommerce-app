const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReview = async (req, res) => {
    try {
        const { productId, performanceScore, valueScore, gamingExperience, comment } = req.body;
        const userId = req.user.id; // From authMiddleware

        const review = await prisma.review.create({
            data: {
                userId: BigInt(userId),
                productId: BigInt(productId),
                performanceScore: parseInt(performanceScore),
                valueScore: parseInt(valueScore),
                gamingExperience: parseInt(gamingExperience),
                comment
            }
        });

        res.status(201).json({ ...review, id: review.id.toString(), userId: review.userId.toString(), productId: review.productId.toString() });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Failed to create review' });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { productId: BigInt(productId) },
            include: { user: { select: { username: true } } }
        });

        const serialized = reviews.map(review => ({
            ...review,
            id: review.id.toString(),
            userId: review.userId.toString(),
            productId: review.productId.toString()
        }));

        res.json(serialized);
    } catch (error) {
        console.error('Fetch reviews error:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

module.exports = { createReview, getProductReviews };
