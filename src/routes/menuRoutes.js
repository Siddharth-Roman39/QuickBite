const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMenu);
router.post('/', protect, authorize('admin'), upload.single('image'), addMenuItem);
router.put('/:id', protect, authorize('admin', 'staff'), upload.single('image'), updateMenuItem);
router.put('/:id/toggle', protect, authorize('admin', 'staff'), toggleAvailability);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

module.exports = router;

