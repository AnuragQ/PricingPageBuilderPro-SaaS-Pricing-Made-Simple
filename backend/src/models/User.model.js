const mongoose = require('mongoose');
    // - user_id
    // - username: string
    // - email: string
    // - created_date: datetime
    // - widget : Array
const User = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
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
    }
});

module.exports = User;
