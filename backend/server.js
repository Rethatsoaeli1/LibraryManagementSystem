
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/auth');
const authorizeRole = require('./middleware/authorizeRole');

const app = express();
const db = require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/books', verifyToken, booksRoutes);
app.use('/api/users', verifyToken, authorizeRole('Admin'), usersRoutes);
app.use('/api/transactions', verifyToken, transactionsRoutes);
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Community Library Management System API is running!');
});

// Start server
const PORT = process.env.PORT || 5000;

// Test MySQL connection
db.getConnection()
    .then(connection => {
        console.log('MySQL database connected successfully!');
        connection.release();
    })
    .catch(error => {
        console.error('MySQL connection failed:', error.message);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
