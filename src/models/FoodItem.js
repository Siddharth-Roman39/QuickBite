const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: String,
    price: { type: Number, required: true },
    imageUrl: String,
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    description: String,
    ingredients: [String],
    waitingTime: Number,
    rating: { type: Number, default: 0 }
}, {
    timestamps: true, // Creates createdAt and updatedAt
    collection: 'menu_items'
});

module.exports = mongoose.model('FoodItem', menuSchema);

