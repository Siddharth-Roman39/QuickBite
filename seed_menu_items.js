const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Menu = require('./src/models/FoodItem'); // It uses the updated schema/collection

dotenv.config();

const menuData = [
    // 🥪 SNACKS
    { name: "Sheera", category: "snacks", price: 35 },
    { name: "Upma", category: "snacks", price: 35 },
    { name: "Kanda Poha", category: "snacks", price: 35 },
    { name: "Idli", category: "snacks", price: 50 },
    { name: "Medu Wada", category: "snacks", price: 50 },
    { name: "Batata Wada", category: "snacks", price: 35 },
    { name: "Samosa", category: "snacks", price: 35 },
    { name: "Bread Pattice", category: "snacks", price: 35 },
    { name: "Wada Ussal", category: "snacks", price: 50 },
    { name: "Samosa Ussal / Sambhar", category: "snacks", price: 50 },
    { name: "Misal Pav", category: "snacks", price: 50 },
    { name: "Pav Bhaji", category: "snacks", price: 60 },

    // ⏳ FASTING ITEMS
    { name: "Sabudana Wada", category: "fast", price: 50 },
    { name: "Sabudana Khichadi", category: "fast", price: 50 },
    { name: "Finger Chips", category: "fast", price: 50 },

    // 🧁 BAKERY
    { name: "Black Forest Pastry", category: "bakery", price: 50 },
    { name: "Pineapple Pastry", category: "bakery", price: 50 },
    { name: "Sweet Chocolate Pastry", category: "bakery", price: 65 },
    { name: "Cassata Pastry", category: "bakery", price: 65 },
    { name: "Chocolate Biscuit", category: "bakery", price: 20 },
    { name: "Chocolate Ball", category: "bakery", price: 30 },
    { name: "Chocolate Mousse", category: "bakery", price: 50 },
    { name: "Chocolate Muffins", category: "bakery", price: 30 },
    { name: "Choco Chip Pastry", category: "bakery", price: 65 },
    { name: "Brownie", category: "bakery", price: 45 },
    { name: "Chocolate Doughnut", category: "bakery", price: 45 },
    { name: "Choco Chip Doughnut", category: "bakery", price: 45 },

    // 🍽️ SOUTH INDIAN
    { name: "Sada Dosa", category: "south_indian", price: 45 },
    { name: "Masala Dosa", category: "south_indian", price: 60 },
    { name: "Mysore Sada Dosa", category: "south_indian", price: 45 },
    { name: "Mysore Masala Dosa", category: "south_indian", price: 60 },
    { name: "Schezwan Dosa Masala", category: "south_indian", price: 60 },
    { name: "Plain Uttappa", category: "south_indian", price: 45 },
    { name: "Onion Uttappa", category: "south_indian", price: 60 },
    { name: "Tomato Uttappa", category: "south_indian", price: 60 },
    { name: "Tomato Onion Uttappa", category: "south_indian", price: 60 },
    { name: "Masala Uttappa", category: "south_indian", price: 60 },

    // 🍟 NEW SNACKS
    { name: "Veg Cutlet", category: "new_snacks", price: 45 },
    { name: "Bread Roll", category: "new_snacks", price: 45 },
    { name: "Veg Roll", category: "new_snacks", price: 45 },
    { name: "Veg Pattice", category: "new_snacks", price: 45 },

    // 🥡 CHINESE STARTER
    { name: "Idli Chilly Dry", category: "chinese_starter", price: 80 },
    { name: "Gobi Manchurian Dry", category: "chinese_starter", price: 95 },
    { name: "Paneer Schezwan Dry", category: "chinese_starter", price: 100 },
    { name: "Chinese Bhel", category: "chinese_starter", price: 60 },

    // 🍜 CHINESE
    { name: "Veg Fried Rice", category: "chinese", price: 70 },
    { name: "Schezwan Fried Rice", category: "chinese", price: 75 },
    { name: "Hakka Noodles", category: "chinese", price: 70 },
    { name: "Schezwan Noodles", category: "chinese", price: 75 },
    { name: "Triple Schez Rice / Noodles", category: "chinese", price: 85 },
    { name: "Manchurian Rice", category: "chinese", price: 80 },
    { name: "Manchurian Noodles", category: "chinese", price: 80 },

    // 🌯 WRAPS / FRANKIE
    { name: "Veg Roll", category: "wraps_frankie", price: 45 },
    { name: "Cheese Roll", category: "wraps_frankie", price: 55 },
    { name: "Noodles Roll", category: "wraps_frankie", price: 55 },
    { name: "Schezwan Roll", category: "wraps_frankie", price: 55 },
    { name: "Paneer Roll", category: "wraps_frankie", price: 60 },
    { name: "Mayonnaise Roll", category: "wraps_frankie", price: 55 },
    { name: "Cheese Noodles Roll", category: "wraps_frankie", price: 60 },
    { name: "Schezwan Cheese Roll", category: "wraps_frankie", price: 70 },
    { name: "Paneer Schezwan Roll", category: "wraps_frankie", price: 70 },
    { name: "Cheese Mayo Roll", category: "wraps_frankie", price: 65 },

    // 🥪 SANDWICHES
    { name: "Veg Sandwich", category: "sandwiches", price: 45 },
    { name: "Veg Toast Sandwich", category: "sandwiches", price: 55 },
    { name: "Veg Cheese Sandwich", category: "sandwiches", price: 55 },
    { name: "Only Cheese Sandwich", category: "sandwiches", price: 40 },
    { name: "Veg Cheese Toast Sandwich", category: "sandwiches", price: 65 },
    { name: "Veg Grilled Sandwich", category: "sandwiches", price: 70 },
    { name: "Veg Cheese Grilled Sandwich", category: "sandwiches", price: 85 },
    { name: "Bread Butter", category: "sandwiches", price: 25 },
    { name: "Bread Butter Toast", category: "sandwiches", price: 25 },
    { name: "Jam Bread Butter", category: "sandwiches", price: 30 },

    // 🥗 CHAT
    { name: "Sev Puri", category: "chat", price: 45 },
    { name: "Bhel", category: "chat", price: 45 },
    { name: "Dahi Sev Puri", category: "chat", price: 55 },
    { name: "Dahi Bhel", category: "chat", price: 55 },
    { name: "Ragda Puri", category: "chat", price: 45 },
    { name: "Dahi Ragda Puri", category: "chat", price: 45 },
    { name: "Papdi Chat", category: "chat", price: 45 },
    { name: "Dahi Papdi Chat", category: "chat", price: 55 },

    // 🍛 LUNCH
    { name: "Chapati Bhaji", category: "lunch", price: 60 },
    { name: "Dal Rice", category: "lunch", price: 60 },
    { name: "Lunch Plate", category: "lunch", price: 80 },
    { name: "Dal", category: "lunch", price: 30 },
    { name: "Bhaji", category: "lunch", price: 30 },
    { name: "Extra Chapati", category: "lunch", price: 7 },
    { name: "Extra Rice", category: "lunch", price: 30 },

    // 🍚 SPECIAL RICE
    { name: "Veg Biryani", category: "special_rice", price: 80 },
    { name: "Veg Pulav", category: "special_rice", price: 80 },
    { name: "Tawa Pulav", category: "special_rice", price: 80 },
    { name: "Green Peas Pulav", category: "special_rice", price: 80 },
    { name: "Dal Khichdi", category: "special_rice", price: 80 },
    { name: "Curd Rice", category: "special_rice", price: 80 },

    // ☕ BEVERAGES
    { name: "Tea", category: "beverages", price: 15 },
    { name: "Coffee", category: "beverages", price: 20 },
    { name: "Sweet Lassi", category: "beverages", price: 20 },
    { name: "Butter Milk", category: "beverages", price: 15 },
    { name: "Lemon Juice", category: "beverages", price: 35 },

    // 🧃 JUICE
    { name: "Mosambi Juice", category: "juice", price: 50 },
    { name: "Watermelon Juice", category: "juice", price: 50 },
    { name: "Cocktail Juice", category: "juice", price: 50 },
    { name: "Pineapple Juice", category: "juice", price: 50 }
];

const seedMenu = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing items
        await Menu.deleteMany({});
        console.log('Cleared existing menu items');

        // Enhance data with default values
        const enhancedData = menuData.map(item => ({
            ...item,
            isVeg: true,
            isAvailable: true,
            imageUrl: '', // Can be populated later
            description: `Delicious ${item.name}`,
            waitingTime: 10,
            rating: 4.5
        }));

        await Menu.insertMany(enhancedData);
        console.log(`Successfully seeded ${enhancedData.length} menu items`);

        process.exit();
    } catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
};

seedMenu();
