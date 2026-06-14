// middlewares/protect.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// Middleware to protect routes: accepts token in cookie or Authorization header
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.token) token = req.cookies.token;
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) return next(new AppError('You are not logged in. Token missing.', 401));

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return next(new AppError('The user belonging to this token no longer exists.', 401));

        req.user = currentUser;
        next();
    } catch (err) {
        return next(new AppError('Invalid or expired token.', 401));
    }
};
