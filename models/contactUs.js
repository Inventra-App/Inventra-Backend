const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
