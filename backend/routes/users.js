
const express = require('express');
const router = express.Router();
const db = require('../config/db');


// GET all users
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, membership_id, role, created_at FROM users'
        );

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// POST a new user
router.post('/', async (req, res) => {
    try {
        const { name, membership_id, role, password } = req.body;

        if (!name || !membership_id || !password) {
            return res.status(400).json({
                message: 'Name, membership ID and password are required.'
            });
        }

        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, membership_id, role, password_hash) VALUES (?, ?, ?, ?)',
            [name, membership_id, role || 'Member', passwordHash]
        );

        res.status(201).json({
            message: 'User added successfully!',
            userId: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PUT - Update an existing user
router.put('/:id', async (req, res) => {
    try {
        const { name, membership_id, role } = req.body;
        const { id } = req.params;

        if (!name || !membership_id || !role) {
            return res.status(400).json({
                message: 'Name, membership ID and role are required.'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?',
            [name, membership_id, role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        res.json({ message: 'User updated successfully!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DELETE a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        res.json({ message: 'User deleted successfully!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
