require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Transaction = require('./src/models/Transaction');
const Order = require('./src/models/Order');

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Check Users and Wallet Balances
        const users = await User.find({ role: 'student' }).select('email walletBalance profile');
        console.log('\n--- Student Wallets ---');
        users.forEach(u => {
            console.log(`User: ${u.email} (${u.profile?.fullName || 'No Name'})`);
            console.log(`Balance: ${u.walletBalance}`);
            console.log('-------------------');
        });

        // 2. Check Recent Transactions
        const transactions = await Transaction.find().sort({ date: -1 }).limit(5);
        console.log('\n--- Last 5 Transactions ---');
        transactions.forEach(t => {
            console.log(`[${t.date.toISOString()}] ${t.type.toUpperCase()}: ${t.amount} - ${t.description} (User: ${t.userId})`);
        });

        // 3. Check Recent Orders
        const orders = await Order.find().sort({ placedAt: -1 }).limit(5);
        console.log('\n--- Last 5 Orders ---');
        orders.forEach(o => {
            console.log(`[${o.placedAt.toISOString()}] Status: ${o.status}, Amount: ${o.totalAmount}, Payment: ${o.paymentMethod} (${o.paymentStatus})`);
        });

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
