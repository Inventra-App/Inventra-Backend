const UserModel = require('../models/user');
const { signUpOtpTemplate } = require('../helpers/emailTemplates');
const {brevo} = require('../helpers/brevo');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken')

exports.signUp = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            businessName,
            phoneNumber,
            password,
            confirmPassword
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
        const user = new UserModel({
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
            data: user
        })
        // console.log(`New user created: `, newUser)

    }catch (error) {
        next(error)
    } 
}

exports.verifyUser = async (req,res,next) =>{
    try{
   
        const {email,otp} = req.body;
        const user = await UserModel.findOne({email:email.toLowerCase})

        if (!user) {
        return next({
            message: 'User not found',
            statusCode:404
        })
       }
       if (new Date() > user.otpExpires || user.otp != otp ) {
        return next({
            message: 'Invalid OTP',
            statusCode:404
        })
       }

       user.isVerified = true;
       user.otp = null
       user.otpExpires = null

       await user.save()

       res.status(200).json({
        message: 'User verified successfully'
       })


    }catch(error){
        next(error)
    }
}


exports.resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email })
        if (!user) {
            return next({
                message: 'User not found',
                statusCode:404
            })
        }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const expires = new Date(Date.now() + 10 * 60000);

        user.otp = OTP;
        user.otpExpires = expires;

        const emailOptions = {
            email: newUser.email,
            subject: 'New otp confirmation',
            html: signUpTemplate(newUser.name, OTP)
        }

        await sendMail(emailOptions);

        await user.save()

        res.status(200).json({
            message: 'OTP resent successfully'
        })
    } catch (error) {
       next({
            message: error.message,
            statusCode:500
        }) 
    }
};

exports.login = async( req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return next({
                message: 'User not found',
                statusCode:404
            })
        }

        if (user.isVerified == false) {
            return next({
                message: 'Please verify your email',
                statusCode:404
            })
        }
        //  check if account is locked due to too many failed login attempts
        if(user.lockUntil && user.lockUntil > Date.now()){
            return next({
                message: 'Account is locke until ${user.lockUntil}.',
                statusCode:403
            })
        }



        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            // increment login attaempt and lock account if necessary
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 2 * 60000);
                user.loginAttempts = 0; // Reset login attempts
            }

            await user.save();
            return next({
                message: 'Invalid credentials',
                statusCode:400
            })
        }

        const token = await jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1day'});

        res.status(200).json({
            message: 'Login Successful',
            token
        })
    } catch (error) {
        next({
            message: error.message,
            statusCode:500
        }) 
    }
}


