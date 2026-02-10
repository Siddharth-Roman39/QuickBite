const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getLiveOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders); // Student: Mine, Admin/Staff: All
router.get('/live', protect, authorize('staff', 'admin'), getLiveOrders);
router.get('/staff', protect, authorize('staff', 'admin'), getLiveOrders); // Alias for specific Staff endpoint request
router.get('/admin', protect, authorize('admin'), getMyOrders); // Alias for specific Admin endpoint request (returns all)
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateOrderStatus);

module.exports = router;
