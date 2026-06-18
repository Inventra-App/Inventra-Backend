const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    supermarket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },

    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
     
    action: {
        type: String,
        required: true
    },

    entity: {
        type: String // product, sale, category, batch
    },

    entityId: {
        type: mongoose.Schema.Types.ObjectId
    },

    details: {
        type: Object
    },

    ipAddress: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);