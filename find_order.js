const mongoose = require('mongoose');
const Order = require('./src/models/Order');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const findOrder = async () => {
    await connectDB();
    const order = await Order.findOne().sort({ placedAt: -1 });
    if (order) {
        console.log(`ORDER_ID:${order._id}`);
        console.log(`ORDER_STATUS:${order.status}`);
    } else {
        console.log('NO_ORDERS_FOUND');
    }
    await mongoose.disconnect(); // Correctly close connection
    process.exit(0); // Ensure process exits
};

findOrder();
