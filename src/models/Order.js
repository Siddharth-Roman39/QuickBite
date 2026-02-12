const mongoose = require('mongoose');
// Ensure FoodItem model is registered before Order uses it
require('./FoodItem');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
        name: String,
        price: Number,
        quantity: Number,
        instructions: String,
        selectedAddOns: [Object] // Flexible for now
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['placed', 'preparing', 'prepared', 'delivered', 'cancelled'],
        default: 'placed'
    },
    orderType: {
        type: String,
        enum: ['dine_in', 'takeaway'],
        default: 'takeaway'
    },
    tokenNumber: Number,
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    paymentMethod: { type: String, default: 'Wallet' },
    paymentStatus: { type: String, default: 'pending' },
    placedAt: { type: Date, default: Date.now },
    preparedAt: Date,
    readyAt: Date,
    deliveredAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
