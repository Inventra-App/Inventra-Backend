const UserModel = require('../models/user');
const { signUpOtpTemplate } = require('../helpers/emailTemplates');
const {brevo} = require('../helpers/brevo');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt')

exports.signUp = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            businessName,
            phoneNumber,
            password,
            confrimPassword
        } = req.body;

        const existingUser = await UserModel.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                message: `User already exists. Please proceed to login`
            })
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        brevo(email, firstName, signUpOtpTemplate(firstName, otp))

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            businessName,
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpires
        })                                              

        res.status(201).json({
            message: "Welcome to Inventra! Please check your email for the OTP to complete your registration.",
            data: newUser
        })
        // console.log(`New user created: `, newUser)

    }catch (error) {
        next(error)
    } 
}