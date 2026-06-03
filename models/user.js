const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    otp: {
        type: String,
        trim: true
    },
    otpExpires: {
        type: String,
        trim: true
    },

    isVerified:{
     type: Boolean,
     default: false
    },
    loginAttempts: {
        type: Number,
        default: 0
    },

    lockUntil: {
        type: Date
    },
}, {timeStamps: true})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel;