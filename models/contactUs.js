const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['demo', 'inquiry']
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending"
    }
}, {
    timestamps: true
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;