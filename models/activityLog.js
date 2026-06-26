const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    supermarket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },

    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },

    staffName: {
        type: String,
        // required: true
    },

    role: {
        type: String,
        enum: ['admin', 'sales', 'manager']
    },

    action: {
        type: String,
        required: true
    },

    module: {
        type: String,
        required: true,
        enum: [
            'AUTH',
            'PRODUCT',
            'CATEGORY',
            'INVENTORY',
            'SALE',
        ]
    },

    entity: {
        type: String,
        required: true
    },

    entityId: {
        type: mongoose.Schema.Types.ObjectId
    },

    description: {
        type: String,
        required: true
    },

    details: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    triggeredAt: {
        type: Date
    }
}, {
    timestamps: true
});

const ActivityLogModel = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLogModel