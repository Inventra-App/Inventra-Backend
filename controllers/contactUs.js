const ContactUs = require('../models/contactUs');

exports.receiveContactRequest = async (req, res, next) => {
    try {
        const { firstName, email, phoneNumber, message } = req.body;

        const newRequest = await ContactUs.create({
            firstName,
            email,
            phoneNumber,
            message
        });

        res.status(201).json({
            message: `Thank you for reaching out, we'll send you a response as soon as possible`,
            data: newRequest
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
