const mongoose = require('mongoose');

    // - widget_id
    // - user_id
    // - creation_date
    // - updated_at
    // - template_id
    // - template_meta_data : [
    //     {  
    //         "plan_title":string,
    //         "plan_pricing":string,
    //         "plan_currency": string,
    //         "plan_features_core":[]
    //         "plan_features_addons":[]
    //         "plan_duration":int
    //     },{

    //     },..]

const widgetSchema = new mongoose.Schema({
    widget_id: {
        type: Number,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    template_id: {
        type: Number,
        required: true
    },
    template_meta_data: {
        type: Array,
        default: []
    }
});