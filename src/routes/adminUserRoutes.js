const express = require('express');
const router = express.Router();
const {
    getUsersByRole,
    createUser,
    updateUserStatus,
    deleteUser
} = require('../controllers/adminUserController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsersByRole);
router.post('/', createUser);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
