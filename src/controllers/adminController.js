const Order = require('../models/Order');

// @desc    Get admin summary (Revenue, Counts)
// @route   GET /api/admin/summary
// @access  Private (Admin)
// @desc    Get total revenue (sum of all non-cancelled orders)
// @route   GET /api/admin/total-revenue
// @access  Private (Admin)
const getTotalRevenue = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const revenue = stats.length > 0 ? stats[0].totalRevenue : 0;
        res.json({ totalRevenue: revenue });
    } catch (error) {
        next(error);
    }
};

const getAdminSummary = async (req, res, next) => {
    try {
        const { range } = req.query;
        // console.log(`Admin Summary Request - Range: ${range}`);

        let matchStage = { status: { $ne: 'cancelled' } };

        const now = new Date();
        let startDate;

        if (range === 'week') {
            // Start of current week (Sunday)
            const d = new Date(now); // Clone to avoid mutation issues if any
            const day = d.getDay();
            const diff = d.getDate() - day;
            startDate = new Date(d.setDate(diff));
            startDate.setHours(0, 0, 0, 0);
        } else if (range === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (range === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
        }

        if (startDate) {
            matchStage.placedAt = { $gte: startDate };
        }

        const stats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    walletOrders: {
                        $sum: {
                            $cond: [{ $in: [{ $toLower: '$paymentMethod' }, ['wallet']] }, 1, 0]
                        }
                    },
                    cashOrders: {
                        $sum: {
                            $cond: [{ $in: [{ $toLower: '$paymentMethod' }, ['cash']] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        console.log('Admin Summary Stats:', JSON.stringify(stats));

        const result = stats.length > 0 ? stats[0] : {
            totalRevenue: 0,
            totalOrders: 0,
            walletOrders: 0,
            cashOrders: 0
        };

        res.json({
            totalRevenue: result.totalRevenue || 0,
            totalOrders: result.totalOrders || 0,
            walletOrders: result.walletOrders || 0,
            cashOrders: result.cashOrders || 0
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getAdminSummary, getTotalRevenue };
