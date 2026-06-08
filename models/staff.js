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
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['sales', 'manager'],
        required: true
    },
}, { timestamps: true});

const staffModel = mongoose.model('Staff', staffSchema);

module.exports = staffModel;