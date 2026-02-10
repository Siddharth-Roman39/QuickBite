const mongoose = require('mongoose');

const staffLogSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staffName: {
        type: String,
        required: true
    },
    action: {
        type: String, // 'LOGIN', 'LOGOUT'
        enum: ['LOGIN', 'LOGOUT'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // For easy session tracking, we can link a logout to a login, 
    // or just store raw events. Storing a 'session' might be cleaner for the UI requested.
    // Let's stick to a Session model instead? 
    // Actually, the user asked for "login time and logout time". 
    // A single document representing a SESSION (login + optionally logout) is easier to query.
    loginTime: {
        type: Date,
        required: true
    },
    logoutTime: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('StaffLog', staffLogSchema);
