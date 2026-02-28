const jwt = require('jsonwebtoken');
const User = require('../models/User');

const fs = require('fs');
const path = require('path');

function loadTask() {
    const tasksFilePath = path.join(__dirname, '..', 'data', 'task.json');
    return JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
};

const verifyAdmin = async (req, res, next) => {
    try {
        const users = loadUsers();
        const user = users.find(u => u.id === req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { verifyToken, verifyAdmin };