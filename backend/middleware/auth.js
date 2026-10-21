const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Required auth — 401 without a valid Bearer token.
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Optional auth — sets req.user when a valid token is present, otherwise carries on as a public request.
auth.optional = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try { req.user = jwt.verify(token, JWT_SECRET); } catch { /* treat as public */ }
    }
    next();
};

module.exports = auth;
