const Menu = require('../models/FoodItem'); // Points to the file we just updated

// @desc    Get all menu items or filter by category
// @route   GET /api/menu
// @access  Public
const getMenu = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        if (category && category !== 'all') {
            // Case-insensitive match if needed, but exact match is faster/predictable
            query.category = category;
        }

        const menu = await Menu.find(query).sort({ category: 1, name: 1 });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a menu item
// @route   POST /api/menu
// @access  Private/Admin
const addMenuItem = async (req, res) => {
    try {
        const {
            name, category, subCategory, price, imageUrl,
            isVeg, isAvailable, description, ingredients, waitingTime
        } = req.body;

        const menuItem = new Menu({
            name,
            category,
            subCategory,
            price,
            imageUrl,
            isVeg: isVeg !== undefined ? isVeg : true,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            description,
            ingredients,
            waitingTime
        });

        const createdItem = await menuItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Staff (some fields) / Admin (all fields)
const updateMenuItem = async (req, res) => {
    try {
        const {
            name, category, subCategory, price, imageUrl,
            isVeg, isAvailable, description, ingredients, waitingTime
        } = req.body;

        const item = await Menu.findById(req.params.id);

        if (item) {
            item.name = name || item.name;
            item.category = category || item.category;
            item.subCategory = subCategory || item.subCategory;
            if (price !== undefined) item.price = price;
            item.imageUrl = imageUrl || item.imageUrl;
            if (isVeg !== undefined) item.isVeg = isVeg;
            if (isAvailable !== undefined) item.isAvailable = isAvailable;
            item.description = description || item.description;
            item.ingredients = ingredients || item.ingredients;
            if (waitingTime !== undefined) item.waitingTime = waitingTime;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle availability
// @route   PUT /api/menu/:id/toggle
// @access  Private/Staff/Admin
const toggleAvailability = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (item) {
            item.isAvailable = !item.isAvailable;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (item) {
            await item.deleteOne();
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
};
