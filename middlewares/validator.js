const joi = require('joi');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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
        phoneNumber: joi.string().trim().pattern(/^[0-9]{10,15}$/).required().messages({
            'any.required':'Phone Number is required',
            'string.empty':'Phone Number cannot be Empty',
            'string.pattern.base':'Phone Number must be between 10 and 15 digits'
        }),
        password: joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d[^A-Za-z0-9]]{8,}$/)
        .required()
        .messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
            }),

        confirmPassword: joi.string()
        .valid(joi.ref('password'))
        .required()
        .messages({
            'any.required': 'Please confirm password',
            'string.empty': 'Please confirm password',
            'any.only': 'Passwords do not match'
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

exports.resendOtpValidator = (req, res, next) => {
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


const Joi = require('joi');

exports.createStaffValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required().messages({
                'string.empty': 'First name is required',
                'string.min': 'First name must be at least 2 characters',
                'string.max': 'First name must not exceed 50 characters',
                'any.required': 'First name is required'
            }),
        lastName: Joi.string().trim().min(2).max(50).required().messages({
                'string.empty': 'Last name is required',
                'string.min': 'Last name must be at least 2 characters',
                'string.max': 'Last name must not exceed 50 characters',
                'any.required': 'Last name is required'
            }),
        password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Z])(?=.*\d)/).required().messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters',
                'string.max': 'Password must not exceed 20 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
                'any.required': 'Password is required'
            }),
        role: Joi.string().valid('sales', 'manager').required().messages({
                'string.empty': 'Role is required',
                'any.only': 'Role must be either sales or manager',
                'any.required': 'Role is required'
            }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }
    next();
};

exports.loginStaffValidator = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().trim().required().messages({
                'string.empty': 'Username is required',
                'any.required': 'Username is required'
            }),
        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }
    next();
};





