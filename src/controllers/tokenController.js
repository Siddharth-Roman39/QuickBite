const TokenCounter = require('../models/TokenCounter');

// @desc    Reset daily token counter
// @route   POST /api/admin/token/reset
// @access  Admin only
exports.resetTokenCounter = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find today's counter or create if not exists
        let counter = await TokenCounter.findOne({ date: today });

        if (!counter) {
            counter = new TokenCounter({ date: today, lastToken: 0 });
        } else {
            // Reset to 0
            counter.lastToken = 0;
        }

        await counter.save();

        res.json({
            message: 'Token counter reset successfully',
            date: today,
            nextTokensStartAt: 1
        });
    } catch (error) {
        console.error("Error resetting token:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
