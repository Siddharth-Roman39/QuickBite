const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path to your User model
const dotenv = require('dotenv');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'email role profile.fullName');

        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('\n--- Existing Users ---');
            users.forEach(u => {
                console.log(`Role: [${u.role.toUpperCase()}] | Name: ${u.profile?.fullName || 'N/A'} | Email: ${u.email}`);
            });
            console.log('----------------------\n');
            console.log('NOTE: Passwords are hashed and cannot be retrieved.');
            console.log('If you need access, use the Admin User Management to create a new user with a known password, or reset one.');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
