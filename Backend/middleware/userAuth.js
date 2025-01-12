const { userModel } = require('../models/user.model.js');
const redisClient = require('../service/redis.service.js');
const { verifyToken } = require('../utils/jwt.js');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Access Denied. No token provided." });
        }
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ error: "Invalid or expired token." });
        }
        const decoded = await verifyToken(token);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ error: "Invalid or expired token." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = auth;
