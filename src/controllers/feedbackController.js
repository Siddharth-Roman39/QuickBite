const Feedback = require('../models/Feedback');

// @desc    Submit Feedback
// @route   POST /api/feedback
// @access  Private
// @desc    Submit Feedback
// @route   POST /api/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const feedback = await Feedback.create({
            studentId: req.user._id,
            rating,
            comment: comment ? comment.trim() : ''
        });

        // Realtime update
        if (global.io) {
            const populatedFeedback = await Feedback.findById(feedback._id).populate('studentId', 'profile email');
            console.log('Socket: Emitting feedback:new to all clients');
            global.io.emit('feedback:new', populatedFeedback);
        }

        console.log(`Feedback submitted by user ${req.user._id}`);
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Feedbacks (Admin)
// @route   GET /api/feedback/admin
// @access  Private (Admin)
const getFeedbacks = async (req, res) => {
    try {
        console.log('Admin fetching feedbacks...');
        const feedbacks = await Feedback.find({})
            .populate('studentId', 'profile email')
            .sort({ createdAt: -1 });

        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks (Admin):', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Feedbacks (Staff)
// @route   GET /api/feedback/staff
// @access  Private (Staff)
const getFeedbacksForStaff = async (req, res) => {
    try {
        console.log('Staff fetching feedbacks...');
        const feedbacks = await Feedback.find({})
            .populate('studentId', 'profile email')
            .sort({ createdAt: -1 });

        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks (Staff):', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitFeedback,
    getFeedbacks,
    getFeedbacksForStaff
};
