const mongoose = require('mongoose');
    // - user_id
    // - username: string
    // - email: string
    // - created_date: datetime
    // - widget : Array
const User = new mongoose.Schema({
    user_id: {
        type: Number,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    widget: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', User);
