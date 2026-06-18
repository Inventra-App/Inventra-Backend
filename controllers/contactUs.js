const ContactUs = require('../models/contactUs');
const { brevo } = require('../helpers/brevo');
const sendMail = require('../helpers/nodemailer');
const { contactUsTemplate } = require('../helpers/emailTemplates');

exports.receiveContactRequest = async (req, res, next) => {
    try {
        const { firstName, email, phoneNumber, message } = req.body;

        const newRequest = await ContactUs.create({
            firstName,
            email,
            phoneNumber,
            message
        });

        const info = process.env.NODE_ENV;

        if (info === "production") {
            await brevo(
                process.env.CONTACT_RECEIVER_EMAIL,
                "Inventra Support",
                contactUsTemplate(firstName, email, phoneNumber, message)
            );
        } else {
            await sendMail({
                email: process.env.CONTACT_RECEIVER_EMAIL,
                subject: "New Contact Request",
                html: contactUsTemplate(firstName, email, phoneNumber, message)
            });
        }

        res.status(201).json({
            message: `Thank you for reaching out, we'll send you a response as soon as possible`,
            data: newRequest
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
