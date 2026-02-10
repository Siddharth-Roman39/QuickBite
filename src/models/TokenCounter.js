const mongoose = require('mongoose');

const tokenCounterSchema = new mongoose.Schema({
    date: {
        type: String, // YYYY-MM-DD
        required: true,
        unique: true
    },
    lastToken: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('TokenCounter', tokenCounterSchema);
