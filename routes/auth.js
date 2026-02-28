const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const fs = require('fs');
const path = require('path');

function loadUsers() {
    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    return users;
}

// Route de Connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    try {
        const users = loadUsers();
        const user = users.find(u => u.email === email);

        if (user && bcrypt.compareSync(password, user.password)) {
            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' });
            res.json({ message: 'Login successful', accessToken, refreshToken });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error loading users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;