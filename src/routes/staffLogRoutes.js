const express = require('express');
const router = express.Router();
const StaffLog = require('../models/StaffLog');
const { protect } = require('../middleware/auth');

// Get all staff logs (for Admin)
router.get('/', protect, async (req, res) => {
    try {
        // Return all logs sorted by loginTime descending
        const logs = await StaffLog.find().sort({ loginTime: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current active session for a specific staff (for Staff drawer)
router.get('/active-session', protect, async (req, res) => {
    try {
        const session = await StaffLog.findOne({
            staffId: req.user.id,
            logoutTime: null
        }).sort({ loginTime: -1 });

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new login session (Internal use mostly, but exposed if needed)
// Better to handle this in authController, but we can have a route for explicit "Check-in/Check-out" if architecture demands.
// For now, let's keep it here for the Frontend to call explicitly on Login/Logout success.

// POST /api/staff-logs/login
router.post('/login', protect, async (req, res) => {
    try {
        const { fullName } = req.body; // Pass name from frontend or fetch from DB

        // Close any previous open sessions for this user (cleanup)
        await StaffLog.updateMany(
            { staffId: req.user.id, logoutTime: null },
            { $set: { logoutTime: new Date() } }
        );

        const newLog = new StaffLog({
            staffId: req.user.id,
            staffName: fullName || 'Staff Member',
            action: 'LOGIN',
            loginTime: new Date()
        });

        await newLog.save();
        res.status(201).json(newLog);
    } catch (error) {
        console.error('Login log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/staff-logs/logout
router.post('/logout', protect, async (req, res) => {
    try {
        // Find the latest open session
        const session = await StaffLog.findOne({
            staffId: req.user.id,
            logoutTime: null
        }).sort({ loginTime: -1 });

        if (session) {
            session.logoutTime = new Date();
            session.action = 'LOGOUT'; // Update action status if we want
            await session.save();
            res.json(session);
        } else {
            res.status(404).json({ message: 'No active session found' });
        }
    } catch (error) {
        console.error('Logout log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
