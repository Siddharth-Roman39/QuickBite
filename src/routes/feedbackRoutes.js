const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbacks, getFeedbacksForStaff } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

// Student Submit
router.post('/', protect, authorize('student'), submitFeedback);

// Staff View
router.get('/staff', protect, authorize('staff'), getFeedbacksForStaff);

// Admin View
router.get('/admin', protect, authorize('admin'), getFeedbacks);

module.exports = router;
