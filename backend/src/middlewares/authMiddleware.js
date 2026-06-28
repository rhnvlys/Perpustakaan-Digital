const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return error(res, 'Token tidak disediakan', 401);
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return error(res, 'Token tidak valid', 401);
        req.user = decoded;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return error(res, 'Akses ditolak. Hanya untuk Admin', 403);
    }
};