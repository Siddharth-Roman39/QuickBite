require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const FoodItem = require('./src/models/FoodItem');
const Order = require('./src/models/Order');
const Transaction = require('./src/models/Transaction');
const Feedback = require('./src/models/Feedback');
const Announcement = require('./src/models/Announcement');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany();
        await FoodItem.deleteMany();
        await Order.deleteMany();
        await Transaction.deleteMany();
        await Feedback.deleteMany();
        await Announcement.deleteMany();

        console.log('Data Cleared...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // --- Users ---
        // Create exactly 3 users
        const users = [
            // Admin
            {
                email: 'admin@canteen.com',
                password: hashedPassword,
                role: 'admin',
                profile: { fullName: 'Super Admin' },
                walletBalance: 0
            },
            // Staff x2
            {
                email: 'staff1@canteen.com',
                password: hashedPassword,
                role: 'staff',
                profile: { fullName: 'Kitchen Staff 1', department: 'Kitchen' },
                walletBalance: 0
            },
            {
                email: 'staff2@canteen.com',
                password: hashedPassword,
                role: 'staff',
                profile: { fullName: 'Counter Staff 2', department: 'Counter' },
                walletBalance: 0
            },
            // Students x3
            {
                email: 's1@canteen.com',
                password: hashedPassword,
                role: 'student',
                profile: { fullName: 'Student One', studentId: 'S101', course: 'B.Tech' },
                walletBalance: 2000
            },
            {
                email: 's2@canteen.com',
                password: hashedPassword,
                role: 'student',
                profile: { fullName: 'Student Two', studentId: 'S102', course: 'B.Sc' },
                walletBalance: 2000
            },
            {
                email: 's3@canteen.com',
                password: hashedPassword,
                role: 'student',
                profile: { fullName: 'Student Three', studentId: 'S103', course: 'B.Com' },
                walletBalance: 2000
            }
        ];

        const createdUsers = await User.insertMany(users);
        const student = createdUsers.find(u => u.role === 'student');
        console.log('3 Users Seeded (Admin, Staff, Student)');

        // --- Food Items ---
        const foodCategories = ['Starters', 'Fast Food', 'South Indian', 'Chinese', 'Desserts'];
        const foodNames = [
            'Veg Burger', 'Chicken Sandwich', 'Masala Dosa', 'Veg Biryani', 'Cold Coffee',
            'Samosa (2 pcs)', 'Chicken Biryani', 'Paneer Tikka', 'Egg Roll', 'Fried Rice',
            'Noodles', 'Manchurian', 'Tea', 'Hot Coffee', 'Lassi',
            'Chole Bhature', 'Pav Bhaji', 'Idli Sambar', 'Vada Pav', 'Momos'
        ];

        const foodItems = foodNames.map((name, index) => ({
            name: name,
            description: `Delicious ${name} made with fresh ingredients.`,
            price: Math.floor(Math.random() * 150) + 20,
            imageUrl: `https://source.unsplash.com/random/200x200/?${name.split(' ')[0]}`,
            category: foodCategories[index % foodCategories.length],
            isVeg: !name.toLowerCase().includes('chicken') && !name.toLowerCase().includes('egg'),
            waitingTime: Math.floor(Math.random() * 25) + 5,
            rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
        }));

        const createdFood = await FoodItem.insertMany(foodItems);
        console.log(`${createdFood.length} Food Items Seeded`);

        // --- Transactions ---
        // Give the student some history
        const transactions = [
            {
                userId: student._id,
                amount: 2000,
                type: 'credit',
                description: 'Initial Wallet Credit',
                date: new Date()
            }
        ];

        await Transaction.insertMany(transactions);
        console.log(`${transactions.length} Transactions Seeded`);

        // --- Announcements ---
        const announcements = [
            { title: 'Welcome!', content: 'Welcome to the canteen app.', createdAt: new Date() },
            { title: 'Menu Update', content: 'New snacks added.', createdAt: new Date(Date.now() - 86400000) }
        ];
        await Announcement.insertMany(announcements);
        console.log('Announcements Seeded');

        console.log('Database Seeded Successfully! (Clean State)');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
