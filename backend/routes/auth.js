
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST - User login
router.post('/login', async (req, res) => {
    try {
        const { membershipId, password, role } = req.body;

        if (!membershipId || !password || !role) {
            return res.status(400).json({
                message: 'Membership ID, password and role are required.'
            });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE membership_id = ? AND role = ?',
            [membershipId, role]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid login details.'
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid login details.'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                membershipId: user.membership_id,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
