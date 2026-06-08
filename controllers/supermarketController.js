const UserModel = require('../models/supermarket');
const { signUpOtpTemplate } = require('../helpers/emailTemplates');
const {brevo} = require('../helpers/brevo');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res, next) => {
    console.log('here')
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
        const otpExpires = Date.now() + 10 * 60 * 1000;

        // brevo(email, firstName, signUpOtpTemplate(firstName, otp))

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
        
        await user.save();

        res.status(201).json({
            message: "Welcome to Inventra! Please check your email for the OTP to complete your registration.",
            data: user
        })

    }catch (error) {
        next(error)
    } 
}

exports.verifyUser = async (req,res,next) => {
    try{
        const { email, otp } = req.body;
        console.log(email)
        const user = await UserModel.findOne({email})
        console.log(user)

        if (!user) {
        return next({
            message: 'User not found',
            statusCode:404
        })
       }
    //    if (new Date() > user.otpExpires || user.otp != otp ) {
    //     return next({
    //         message: 'Invalid OTP',
    //         statusCode:404
    //     })
    //    }

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

        const user = await UserModel.findOne({ email })
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
                user.loginAttempts = 0; 
            }

            await user.save();
            return next({
                message: 'Invalid credentials',
                statusCode:400
            })
        }

        const token = await jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1day'});

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


exports.forgotPassword = async (req,res,next) =>{
    try {
        
        const {email} = req.body
        const user = await clientModel.findOne({email: email.toLowerCase()})

        if(!user) {
            return res.status(404).json({
                message: "Client not found"
            })
        }
        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expires = new Date(Date.now() + 1000 * 60 * 5);

        if (Date.now() > user.otpExpires || otp !== user.otp){
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            })
        }

        const emailData = {
            name: user.fullName,
            otp: OTP
        }
        await brevo(user.email, user.fullName, resetPasswordTemplate(emailData))
         
        user.otp = OTP;
        user.otpExpires = expires;

        await user.save();

        res.status(200).json({
            message: 'Please check your email for password OTP'
        })



    } catch (error) {
             if (isEmailDeliveryError(error)) {
              return res.status(503).json({
                message: "Unable to send password OTP. Please try again."
            })
        }

        console.log(error.message)       
         res.status(500).json({
            message: "Something went wrong"
        })
    }
}



exports.resetPassword = async (req,res,next) => {
    try {
        const {email, password} = req.body
        const user = await clientModel.findOne({email: email.toLowerCase()})
    
        if(!user) {
            return res.status(404).json({
                message: "Client not found"
            })
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
        
        await user.save()

        await brevo(user.email, user.fullName, resetPasswordSuccessfulTemplate(user.fullName))

        res.status(200).json({
            message: "Password reset successfully"
        })
    
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

  