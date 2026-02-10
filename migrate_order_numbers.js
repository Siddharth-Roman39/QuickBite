
const mongoose = require('mongoose');
const Order = require('./src/models/Order'); // Adjust path
const generateOrderNumber = require('./src/utils/orderNumberGenerator'); // Adjust path
const dotenv = require('dotenv');

dotenv.config();

const migrateOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Migration');

        const orders = await Order.find({ orderNumber: { $exists: false } });
        console.log(`Found ${orders.length} orders without orderNumber.`);

        for (const order of orders) {
            // Generate unique number. Note: generateOrderNumber relies on time, loop might be too fast
            // so we add a random suffix to ensure uniqueness in batch
            const baseNum = generateOrderNumber();
            const random = Math.floor(Math.random() * 1000);
            order.orderNumber = `${baseNum}-${random}`;

            await order.save();
            process.stdout.write('.');
        }

        console.log('\nMigration Complete.');
        process.exit();
    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrateOrders();
