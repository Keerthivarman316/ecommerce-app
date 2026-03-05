const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, email: true, role: true, createdAt: true }
        });
        const serializedUsers = users.map(user => ({
            ...user,
            id: user.id.toString(),
        }));
        res.json(serializedUsers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (role !== 'ADMIN' && role !== 'USER') {
            return res.status(400).json({ error: 'Invalid role. Must be Admin or User' });
        }
        const user = await prisma.user.update({
            where: { id: BigInt(id) },
            data: { role },
            select: { id: true, username: true, role: true }
        });
        res.json({
            id: user.id.toString(),
            username: user.username,
            role: user.role,
            message: 'User role updated successfully'
        });
    }
    catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user.user.id;
        const user = await prisma.user.findUnique({
            where: { id: BigInt(userId) },
            select: { id: true, username: true, email: true, role: true, createdAt: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.id = user.id.toString();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user.user.id;
        const { username, email, password } = req.body;
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: { id: BigInt(userId) },
            data: updateData,
            select: { id: true, username: true, email: true, role: true }
        });
        user.id = user.id.toString();
        res.json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: ' Email already exists' });
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    getUserProfile,
    updateProfile
};
