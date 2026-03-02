const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        req.user = user;
        next();
    });

};
const isAdmin = (req, res, next) => {
    if(req.user && req.user.role === 'ADMIN'){
        next();
    }
    else{
        return res.status(403).json({error: 'Access Denied. Not an admin'});
    }
};

module.exports = { authenticateToken, isAdmin };