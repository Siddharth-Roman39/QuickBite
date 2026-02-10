const express = require('express');
const router = express.Router();
const { getAdminSummary, getTotalRevenue } = require('../controllers/adminController');
const { resetTokenCounter } = require('../controllers/tokenController');
const { protect, authorize } = require('../middleware/auth');

router.get('/summary', protect, authorize('admin'), getAdminSummary);
router.get('/total-revenue', protect, authorize('admin'), getTotalRevenue);
router.post('/token/reset', protect, authorize('admin'), resetTokenCounter);

module.exports = router;
