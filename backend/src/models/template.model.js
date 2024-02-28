const mongoose  = require('mongoose');

    // - plan_title : "string" // style string
    // - plan_pricing:string,
    // - plan_currency: string,
    // - plan_features_core:string,
    // - plan_features_addons:string,
    // - plan_duration:string

const templateSchema = new mongoose.Schema({
    plan_title: {
        type: String,
        required: true
    },
    plan_pricing: {
        type: String,
        required: true
    },
    plan_currency: {
        type: String,
        required: true
    },
    plan_features_core: {
        type: String,
        required: true
    },
    plan_features_addons: {
        type: String,
        required: true
    },
    plan_duration: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Template', templateSchema);
    