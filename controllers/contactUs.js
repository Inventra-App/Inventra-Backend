require('dotenv').config()
const ContactUs = require('../models/contactUs');
const { brevo } = require('../helpers/brevo');
const sendMail = require('../helpers/nodemailer');
const { contactUsTemplate, bookDemoTemplate } = require('../helpers/emailTemplates');

exports.receiveContactRequest = async (req, res, next) => {
    try {
        const {
            firstName,
            email,
            phoneNumber,
            message
        } = req.body;

        // Save request
        const newRequest = await new ContactUs({
            firstName,
            email: email.toLowerCase(),
            phoneNumber,
            message,
            type: 'inquiry'
        });

        res.status(201).json({
            message: "Thank you for reaching out. We'll get back to you soon.",
            data: newRequest
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.receiveDemoRequest = async (req, res, next) => {
    try {
        const { firstName, email, message } = req.body;

        const newRequest = new ContactUs({
            firstName,
            email: email.toLowerCase(),
            message,
            type: 'demo'
        });

        await newRequest.save();
        res.status(201).json({
            message: `Thank you for requesting a demo, we'll get back to you as soon as possible`,
            data: newRequest
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};