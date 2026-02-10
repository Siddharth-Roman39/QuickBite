const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public (or Protected/Student)
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin
exports.createAnnouncement = async (req, res) => {
    try {
        console.log("Incoming announcement body:", req.body);
        const { title, message } = req.body;

        const announcement = new Announcement({
            title,
            message,
        });

        const createdAnnouncement = await announcement.save();
        console.log("Announcement saved:", createdAnnouncement);
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        console.error("Announcement save failed:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (announcement) {
            await announcement.deleteOne();
            res.json({ message: 'Announcement removed' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
