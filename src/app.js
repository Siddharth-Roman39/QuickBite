const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const walletRoutes = require('./routes/walletRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/announcements', announcementRoutes);

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/users', require('./routes/adminUserRoutes')); // New User Management
app.use('/api/staff-logs', require('./routes/staffLogRoutes'));

app.get('/', (req, res) => {
    res.send('Canteen API is running');
});

// Error Handling Middleware
// Error Handling Middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

module.exports = app;
