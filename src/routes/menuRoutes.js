const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getMenu);
router.post('/', protect, authorize('admin'), addMenuItem);
router.put('/:id', protect, authorize('admin', 'staff'), updateMenuItem);
router.put('/:id/toggle', protect, authorize('admin', 'staff'), toggleAvailability);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

module.exports = router;

