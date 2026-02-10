const express = require('express');
const router = express.Router();
const { getWallet, addMoney } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWallet);
router.post('/add', protect, addMoney);

module.exports = router;
