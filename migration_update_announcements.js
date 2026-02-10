
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Migration');

        const result = await mongoose.connection.collection('announcements').updateMany(
            { content: { $exists: true } },
            [
                { $set: { message: "$content" } },
                { $unset: "content" }
            ]
        );

        console.log(`Migration Complete: Modified ${result.modifiedCount} documents.`);
        process.exit();
    } catch (err) {
        console.error('Migration Failed:', err);
        process.exit(1);
    }
};

migrate();
