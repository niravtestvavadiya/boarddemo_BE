
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import models from '../models/index.js';

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export async function isAdmin(req, res, next) {
    const user = await models.User.findByPk(req.userId, { include: 'role' });
    if (!user || user.role.name !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
    next();
}
