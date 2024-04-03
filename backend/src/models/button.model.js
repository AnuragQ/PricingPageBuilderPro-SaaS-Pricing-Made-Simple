const mongoose = require('mongoose');

    // label: string
    // price: number
    // currency: string

const buttonSchema = new mongoose.Schema({
    button_id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Button', buttonSchema);