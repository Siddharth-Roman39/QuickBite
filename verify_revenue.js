const mongoose = require('mongoose');
const Order = require('./src/models/Order');
require('dotenv').config();

async function checkRevenue() {
    await mongoose.connect(process.env.MONGO_URI);

    // Check All Time
    const allTime = await Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalOrders: { $sum: 1 }
            }
        }
    ]);
    console.log('All Time Aggregation:', allTime);

    // Check with Date - This Month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    console.log('Start of Month:', startOfMonth);

    const thisMonth = await Order.aggregate([
        {
            $match: {
                status: { $ne: 'cancelled' },
                placedAt: { $gte: startOfMonth }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalOrders: { $sum: 1 }
            }
        }
    ]);
    console.log('This Month Aggregation:', thisMonth);

    // Check Sample Data
    const sample = await Order.findOne({}, 'totalAmount status placedAt');
    console.log('Sample Document:', sample);

    process.exit();
}

checkRevenue();
