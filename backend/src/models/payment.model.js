const mongoose = require("mongoose");

// - id: string,
// - amount: string,
// - currency: string,
// - status: string,
// - date: string,
// - method: string,
// - description : string

const paymentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    session: {
        type: Object,
        required: true,
    },
    
    // amount: {
    //     type: String,
    //     required: true,
    // },
    // currency: {
    //     type: String,
    //     required: true,
    // },
    // status: {
    //     type: String,
    //     required: true,
    // },
    // date: {
    //     type: String,
    //     required: true,
    // },
    // method: {
    //     type: String,
    //     required: true,
    // },
    // description: {
    //     type: String,
    //     required: true,
    // },
    });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;




