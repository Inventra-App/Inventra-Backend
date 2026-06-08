const mongoose = require('mongoose');
const SubscriptionPlan = require('./subscriptionPlan');

const supermarketSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
    },
    otp: {
        type: String,
        trim: true
    },
    otpExpires: {  
        type: String,
        trim: true
    },
    subscriptionPlanId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'plan_id'
    },
    subscriptionStatus: {
        type: String,
        enum: ['inactive', 'active', 'cancelled'],
    },
    isVerified:{
     type: Boolean,
     default: false
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
}, {timestamps: true})

const SupermarketModel = mongoose.model('Supermarket', supermarketSchema)

module.exports = SupermarketModel;