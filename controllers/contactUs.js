const ContactUs = require('../models/contactUs');
// PERHAPS REQUIRE A MIAL SENDING DEPENDENCY
const userModel = require('../models/supermarket')

exports.receiveContactRequest = async (req, res, next) => {
    try {
        const { firstName, email, phoneNumber, message } = req.body
        
        // perhaps call the mail sender on the name and email.

        const newRequest = await ContactUs.create({
            firstName,
            email,
            phoneNumber,
            message
        })

        await newRequest.save()

        res.status(201).json({
            message: `Thank you for reaching out, we'll send you a response sooner than you can clock!`,
            data: newRequest
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}