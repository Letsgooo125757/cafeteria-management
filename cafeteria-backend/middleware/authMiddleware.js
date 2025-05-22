const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token =req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-passwordHash');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, not token provided' });
    }
};

module.exports = { protect };