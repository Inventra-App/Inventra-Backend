const SupermarketModel = require('../models/supermarket');
const { signUpOtpTemplate, resetPasswordOtpTemplate, resetPasswordSuccessfulTemplate, resendOtpTemplate } = require('../helpers/emailTemplates');
const {brevo} = require('../helpers/brevo');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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

        const existingSupermarket = await SupermarketModel.findOne({email});
        if (existingSupermarket) {
            return res.status(400).json({
                message: `Supermarket already exists. Please proceed to login`
            })
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const otpExpires = Date.now() + 10 * 60 * 1000;

        const hashedPassword = await bcrypt.hash(password, 10);
        const supermarket = new SupermarketModel({
            firstName,
            lastName,
            email,
            businessName,
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpires
        })
        
        await supermarket.save();
        console.log(supermarket)
       await  brevo(email, firstName, signUpOtpTemplate(firstName, otp))


        res.status(201).json({
            message: "Welcome to Inventra! Please check your email for the OTP to complete your registration.",
        
        })

    }catch (error) {
        console.log(error)
        next(error)
    } 
}




exports.verifyUser = async (req,res,next) =>{
    try{
        const { email, otp } = req.body;
        console.log(email)
        const supermarket = await SupermarketModel.findOne({email})
        console.log(supermarket)

        if (!supermarket) {
        return next({
            message: 'Supermarket not found',
            statusCode:404
        })
       }

     if(supermarket.otp !== otp){
            return res.status(400).json({
                message: "Invalid OTP credentials"
            })
        }
        if(Date.now()> supermarket.otpExpires){
            return res.status(400).json({
                message:"OTP Expired"
            })
        }

       supermarket.isVerified = true;
       supermarket.otp = null
       supermarket.otpExpires = null

       await supermarket.save()

       res.status(200).json({
        message: 'Supermarket verified successfully'
       })


    }catch(error){
        next(error)
    }
}



exports.resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const supermarket = await SupermarketModel.findOne({ email })
        if (!supermarket) {
            return next({
                message: 'Supermarket not found',
                statusCode:404
            })
        }

        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const expires = new Date(Date.now() + 10 * 60000);
        
        await  brevo(supermarket.email, supermarket.firstName, resendOtpTemplate(supermarket.firstName, OTP))

        supermarket.otp = OTP;
        supermarket.otpExpires = expires;
        supermarket.verificationType = 'onboarding'

        // const emailOptions = {
        //     email: supermarket.email,
        //     subject: 'New otp confirmation',
        //     html: resendOtpTemplate(supermarket.firstName, OTP)
        // }

        // await sendMail(emailOptions);


        await supermarket.save()

        console.log(OTP)

        res.status(200).json({
            message: 'OTP resent successfully'
        })
    } catch (error) {
        console.log(error)
       next({
            message: error.message,
            statusCode:500
        }) 
    }
};

exports.login = async( req, res, next) => {
    try {
        const { email, password } = req.body

        const supermarket = await SupermarketModel.findOne({ email })
        if (!supermarket) {
            return next({
                message: 'Supermarket not found',
                statusCode:404
            })
        }

        if (supermarket.isVerified == false) {
            return next({
                message: 'Please verify your email',
                statusCode:404
            })
        }
        if(supermarket.lockUntil && supermarket.lockUntil > Date.now()){
            return next({
                message: 'Account is locked until ${supermarket.lockUntil}.',
                statusCode:403
            })
        }

        const passwordCorrect = await bcrypt.compare(password, supermarket.password);

        if (!passwordCorrect) {
            // increment login attaempt and lock account if necessary
            supermarket.loginAttempts += 1;
            if (supermarket.loginAttempts >= 3) {
                supermarket.lockUntil = new Date(Date.now() + 2 * 60000);
                supermarket.loginAttempts = 0; 
            }

            await supermarket.save();
            return next({
                message: 'Invalid credentials',
                statusCode:400
            })
        }
       supermarket.loginAttempts = 0;
       supermarket.lockUntil = null;
       await supermarket.save();

        const token = jwt.sign(
            { id: supermarket._id, role: supermarket.role }, 
            process.env.SECRET_KEY, 
            { expiresIn: '1day' }
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            data: supermarket
        })
    } catch (error) {
        next({
            message: error.message,
            statusCode:500
        }) 
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const supermarket= await SupermarketModel.findOne({ email: email.toLowerCase() });

        if (!supermarket) {
            return res.status(404).json({
                message: "Supermarket not found"
            });
        }

        const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expires = new Date(Date.now() + 1000 * 60 * 5);


        const emailData = {
            name: supermarket.fullName,
            otp: OTP
        };

        await brevo(supermarket.email, supermarket.fullName, resetPasswordOtpTemplate(emailData.name, emailData.otp))

        supermarket.otp = OTP;
        supermarket.otpExpires = expires;
        supermarket.verificationType = 'password'

        await supermarket.save();
        console.log(OTP)

        res.status(200).json({
            message: 'Please check your email for password OTP'
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}



exports.verifyPasswordOtp = async (req,res,next) =>{
    try{
        const { email, otp } = req.body;
        console.log(email)
        const supermarket = await SupermarketModel.findOne({email})
        console.log(supermarket)

        if (!supermarket) {
        return next({
            message: 'Supermarket not found',
            statusCode:404
        })
       };
       
       if(supermarket.otp !== otp){
            return res.status(400).json({
                message: "Invalid OTP credentials"
            })
        }
        if(Date.now()> supermarket.otpExpires){
            return res.status(400).json({
                message:"OTP Expired"
            })
        }

       supermarket.isVerified = true;
       supermarket.otp = null
       supermarket.otpExpires = null;
       supermarket.verificationType = 'password'

       await supermarket.save()

       res.status(200).json({
        message: 'Supermarket verified successfully, proceed to reset your password'
       })


    }catch(error){
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const supermarket = await SupermarketModel.findOne({ email: email.toLowerCase() });

        if (!supermarket) {
            return res.status(404).json({
                message: "Supermarket not found"
            });
        }

        if (supermarket.verificationType !== 'password') {
            return res.status(400).json({
                message: 'Please request for a new OTP'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        supermarket.password = hashedPassword;
        

        await supermarket.save();

        await brevo(supermarket.email, supermarket.fullName, resetPasswordSuccessfulTemplate(supermarket.fullName))

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.loginWithGoogle = async (req, res, next) => {
  try {
    const token = await jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login Successful",
      data: `${req.user.firstName} ${req.user.lastName}`,
      token,
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

exports.addBusinessName = async (req, res, next) => {
    try {
        console.log(req.user)
       const supermarketId = req.user.id;

       const ifSupermarket = await SupermarketModel.findById(supermarketId)
       if (!ifSupermarket) {
        return res.status(403).json({
            message: `You are not a registered business!`
        })
       };

        const { businessName } = req.body;

        const supermarket = await SupermarketModel.findByIdAndUpdate(
            supermarketId,
            {businessName: businessName},
            { new: true, runValidators: true }
        );

        await supermarket.save();
        console.log(supermarket);

        res.status(200).json({
            message: `Business name updated successfully`
        });

    } catch (error) {
        console.log(error)
        next(error)
    }
};

// exports.logout = async (req, res, next) => {
//     try {
//         const { id } = req.user;

//         const user = await SupermarketModel.findById(id);

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         // Remove refresh token
//         user.refreshToken = null;

//         await user.save();

//         return res.status(200).json({
//             message: "Logged out successfully"
//         });

//     } catch (error) {
//         next(error);
//     }
// };

exports.logout = async (req, res, next) => {
    try {
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};