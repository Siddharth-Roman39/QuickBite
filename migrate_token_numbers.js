
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const dotenv = require('dotenv');

dotenv.config();

const migrateTokens = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Token Migration');

        // Find orders without tokenNumber or where tokenNumber is 0/null
        const orders = await Order.find({
            $or: [
                { tokenNumber: { $exists: false } },
                { tokenNumber: null },
                // { tokenNumber: 0 } // Optional: re-generate if 0
            ]
        }).sort({ placedAt: 1 }); // Process oldest to newest

        console.log(`Found ${orders.length} orders to backfill tokens.`);

        // We will assign tokens sequentially based on date. 
        // Since this is a migration, accurate "daily reset" implies we need to track dates.

        let currentDateStr = '';
        let currentToken = 0;

        for (const order of orders) {
            const orderDate = new Date(order.placedAt || order.createdAt || Date.now());
            const dateStr = orderDate.toISOString().split('T')[0]; // YYYY-MM-DD

            if (dateStr !== currentDateStr) {
                // New day, reset token (Simulating daily reset behavior for past orders)
                // However, check if DB already has max token for this day to avoid collision? 
                // For simplicity in migration of *old* mock data, we'll just run 1..N per day locally.
                currentDateStr = dateStr;
                currentToken = 1;
            } else {
                currentToken++;
            }

            order.tokenNumber = currentToken;
            await order.save();
            process.stdout.write('.');
        }

        console.log('\nToken Migration Complete.');
        process.exit();
    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrateTokens();
