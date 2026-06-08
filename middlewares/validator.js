const joi = require('joi');

exports.signUpValidator = (req, res, next) => {
    const signUpSchema = joi.object({
        firstName: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': 'First Name is required',
            'string.empty':'First Name cannot be Empty',
            'string.pattern.base': 'First Name cannot contain numbers and must be atleast 4 characters'
        }),
        lastName: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': 'Last Name is required',
            'string.empty':'Last Name cannot be Empty',
            'string.pattern.base': 'Last Name cannot contain numbers and must be atleast 4 characters'
        }),
        email: joi.string().email().required().messages({
            'any required':'Email is required',
            'string.empty':'Email cannot be Empty',
            'string.email':'Email must be a valid email',
        }),
        businessName: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': 'Business Name is required',
            'string.empty':'Business Name cannot be Empty',
            'string.pattern.base': 'Business Name cannot contain numbers and must be atleast 4 characters'
        }),
        phoneNumber: joi.string().trim().pattern(/^[0-9]{11}$/).required().messages({
            'any.required':'Phone Number is required',
            'string.empty':'Phone Number cannot be Empty',
            'string.pattern.base':'Phone Number must be 11 digits'
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any required':'Password is required',
            'string.empty':'Password cannot be Empty',
            'string.pattern.base':'Password must be 8 chracters must include upper and lower case'
        }),
        confirmPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any required':'Please confirm password',
            'string.empty':'Please confirm password',
            'string.pattern.base':'Password must be 8 chracters must include upper and lower case',
            'any.only':'Password does not match'
        })
    })

    const { error }= signUpSchema.validate(req.body)
    if(error) {
        return res.status(400).json({
            message:error.details[0].message
        })
    }
    next()
}

exports.verifyUserValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        otp: joi.string().trim().length(6).required().messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 characters long',
            'any.required': 'OTP is required'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.loginValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.forgotPasswordValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

exports.resetPasswordValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        otp: joi.string().trim().length(6).required().messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 characters long',
            'any.required': 'OTP is required'
        }),
        password: joi.string().pattern(passwordPattern).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be at least 8 characters and include upper and lower case'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}





