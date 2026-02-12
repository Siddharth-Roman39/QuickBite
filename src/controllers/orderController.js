const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const generateOrderNumber = require('../utils/orderNumberGenerator');
const generateTokenNumber = require('../utils/tokenGenerator');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (Student)
const placeOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, orderType, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No items ordered');
        }

        // Validate Items and Availability
        let verifiedTotalAmount = 0;
        const verifiedItems = [];

        for (const item of items) {
            if (item.quantity <= 0) {
                res.status(400);
                throw new Error(`Invalid quantity for item ${item.foodItemId}`);
            }

            const foodItem = await FoodItem.findById(item.foodItemId);

            if (!foodItem) {
                res.status(404);
                throw new Error(`Food item not found: ${item.foodItemId}`);
            }

            if (!foodItem.isAvailable) {
                res.status(400);
                throw new Error(`Item not available: ${foodItem.name}`);
            }

            verifiedTotalAmount += foodItem.price * item.quantity;
            verifiedItems.push({
                ...item,
                name: foodItem.name,
                price: foodItem.price
            });
        }

        const user = await User.findById(req.user._id);
        const method = paymentMethod || 'wallet';

        if (method === 'wallet') {
            // Check Wallet Balance
            if (user.walletBalance < verifiedTotalAmount) {
                res.status(400);
                throw new Error('Insufficient wallet balance');
            }

            // Deduct Balance
            user.walletBalance -= verifiedTotalAmount;
            await user.save();

            // Create Transaction Record
            await Transaction.create({
                userId: user._id,
                amount: verifiedTotalAmount,
                type: 'debit',
                description: `Order Payment`,
                date: new Date()
            });
        }

        // Create Order
        const orderNumber = generateOrderNumber(); // Generate ID
        const tokenNumber = await generateTokenNumber(); // Generate Token

        const order = new Order({
            userId: req.user._id,
            items: verifiedItems,
            totalAmount: verifiedTotalAmount,
            orderType,
            paymentMethod: method,
            paymentStatus: (method === 'wallet' || method === 'cash') ? 'paid' : 'pending',
            status: 'placed',
            placedAt: new Date(),
            orderNumber: orderNumber, // Save ID
            tokenNumber: tokenNumber // Save Token
        });

        const createdOrder = await order.save();

        // Populate user info and food items for socket payload
        await createdOrder.populate([
            { path: 'userId', select: 'email profile' },
            { path: 'items.foodItemId', select: 'name price imageUrl' }
        ]);

        // Socket.IO: Notify Staff
        const io = req.app.get('io');
        if (io) {
            io.to('staff_room').emit('order:new', createdOrder);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        next(error);
    }
};

// @desc    Get orders (User specific or All for Admin)
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        let query = {};

        // If student, filter by their ID
        if (req.user.role === 'student') {
            query.userId = req.user._id;
        }

        const orders = await Order.find(query)
            .populate('userId', 'profile email')
            .sort({ placedAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get live orders (placed/preparing/prepared)
// @route   GET /api/orders/live
// @access  Private (Staff/Admin)
const getLiveOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            status: { $in: ['placed', 'preparing', 'prepared'] }
        })
            .populate('userId', 'profile email')
            .sort({ placedAt: 1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Staff/Admin)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            const validTransitions = ['placed', 'preparing', 'prepared', 'delivered', 'cancelled', 'completed'];
            if (!validTransitions.includes(status)) {
                res.status(400);
                throw new Error('Invalid status');
            }

            order.status = status;

            if (status === 'preparing') {
                order.preparedAt = new Date();
            } else if (status === 'prepared' || status === 'ready') {
                order.readyAt = new Date();
            } else if (status === 'delivered' || status === 'completed') {
                order.deliveredAt = new Date();
            }

            const updatedOrder = await order.save();

            // Populate necessary fields for frontend
            await updatedOrder.populate([
                { path: 'userId', select: 'email profile' },
                { path: 'items.foodItemId', select: 'name price imageUrl' }
            ]);

            // Socket.IO: Notify Student & Staff
            const io = req.app.get('io');
            if (io) {
                // 1. Notify the User (Student)
                // Assuming order.userId is populated, we need the _id string
                const userId = updatedOrder.userId._id.toString();

                io.to(`user_${userId}`).emit('order:update', updatedOrder);

                // 2. Notify Staff (Sync)
                io.to('staff_room').emit('order:update', updatedOrder);

                if (status === 'completed') {
                    io.emit('admin:summary:update');
                }
            }

            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getLiveOrders,
    updateOrderStatus
};
