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
    plan_description: {
        type: String,
        required: true
    },
    template_image: {
        type: String,
        required: true
    },
    template_code: {
        type: String,
        required: true
    },
    plan_pricing: {
        type: String,
    },
    plan_currency: {
        type: String,
    },
    plan_features_core: {
        type: String,
    },
    plan_features_addons: {
        type: String,
    },
    plan_duration: {
        type: String,
    }
});

module.exports = mongoose.model('Template', templateSchema);
    