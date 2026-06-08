const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    supermarketId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'supermarket',
        required: true
    },
    subscriptionTypeId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'subscriptionPlan',
        required: true
    },
    subscriptionName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'inactive'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
