const User = require('../models/User');

// @desc    Get Users (Students or Staff)
// @route   GET /api/admin/users?role=student
// @access  Admin
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        if (!role) {
            return res.status(400).json({ message: "Role query parameter is required" });
        }

        const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create User (Student/Staff)
// @route   POST /api/admin/users
// @access  Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check duplicate
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Create User (Password hashing is handled by pre-save middleware in User.js)
        const user = await User.create({
            email,
            password,
            role,
            status: 'active',
            profile: {
                fullName: name
            }
        });

        // Return user without password
        const userResponse = await User.findById(user._id).select('-password');
        res.status(201).json(userResponse);

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update User Status
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.status = status;
        await user.save();

        res.json({ message: `User ${status}`, user });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        res.json({ message: "User removed" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
