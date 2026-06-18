const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'admin'
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['cashier', 'manager'],
        required: true
    },
}, { timestamps: true});

const staffModel = mongoose.model('Staff', staffSchema);

module.exports = staffModel;