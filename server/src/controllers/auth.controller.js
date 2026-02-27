const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hasedPassword,
            },
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id.toString(),
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'server error during registration' });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: ' Please provide email and password' });
        }
        const user = await prisma.user.findUnique({ where: { email }, });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: user.id.toString(),
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: payload });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'server error during login' });
    }
};
module.exports = { register, login };