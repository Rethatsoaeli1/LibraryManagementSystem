
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authorizeRole = require('../middleware/authorizeRole');


// GET all books (Admin and Member)
router.get('/', async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// POST a new book (Admin only)
router.post('/', authorizeRole('Admin'), async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (!title || !author || quantity === undefined) {
            return res.status(400).json({
                message: 'Title, author and quantity are required.'
            });
        }

        const [result] = await db.query(
            'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)',
            [title, author, genre || null, isbn || null, quantity]
        );

        res.status(201).json({
            message: 'Book added successfully!',
            bookId: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PUT - Update an existing book (Admin only)
router.put('/:id', authorizeRole('Admin'), async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;
        const { id } = req.params;

        const [result] = await db.query(
            'UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ? WHERE id = ?',
            [title, author, genre || null, isbn || null, quantity, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        res.json({ message: 'Book updated successfully!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DELETE a book (Admin only)
router.delete('/:id', authorizeRole('Admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM books WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        res.json({ message: 'Book deleted successfully!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
