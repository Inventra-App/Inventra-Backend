const { required } = require('joi');
const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    subscriptionName: {
        type: String,
        enum: ['free', 'standard', 'premium'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    maxStaff: {
        type: Number,
        required: true,
    },
    features_Json: {
        type: Object,
        required: false,
        default: {
            "inventory_management": false,
            "sales_tracking": false,
            "expiry_alerts": false,
            "reports": false,
            "multi_staff": false,
            "analytics_dashboard": false,
            "export_reports": false,
            "priority_support": false,
            "api_access": false,
            "multi_branch": false
        }
    }
}, { timestamps: true });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
