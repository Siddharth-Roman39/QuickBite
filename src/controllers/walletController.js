const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get wallet details (balance + transactions)
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });

        res.json({
            balance: user.walletBalance,
            transactions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add money to wallet (Mock Payment)
// @route   POST /api/wallet/add
// @access  Private
const addMoney = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            res.status(400);
            throw new Error('Invalid amount');
        }

        const user = await User.findById(req.user._id);

        // Update Balance
        user.walletBalance = (user.walletBalance || 0) + Number(amount);
        await user.save();

        // Create Transaction Record
        const transaction = await Transaction.create({
            userId: req.user._id,
            amount: amount,
            type: 'credit',
            description: 'Added money to wallet',
            date: new Date()
        });

        res.json({
            balance: user.walletBalance,
            transaction
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWallet,
    addMoney
};
