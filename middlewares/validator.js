const Joi = require('joi');
const mongoose = require('mongoose');

const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const objectIdValidator = Joi.string().custom((value, helpers) => {
    if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
    }
    return value;
});

exports.signUpValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(2).required().messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters'
        }),

        lastName: Joi.string().trim().min(2).required().messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters'
        }),

        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),

        businessName: Joi.string().trim().min(2).required().messages({
            'string.empty': 'Business name is required',
            'string.min': 'Business name must be at least 2 characters'
        }),

        phoneNumber: Joi.string()
            .pattern(/^\d{10,15}$/)
            .required()
            .messages({
                'string.empty': 'Phone number is required',
                'string.pattern.base':
                    'Phone number must be between 10 and 15 digits'
            }),

        password: Joi.string()
            .pattern(passwordPattern)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.pattern.base':
                    'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'string.empty': 'Confirm password is required',
                'any.only': 'Passwords do not match'
            })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.verifyUserValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().pattern(/^\d{6}$/).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.resendOtpValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.loginValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.forgotPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.resetPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),

        password: Joi.string()
            .pattern(passwordPattern)
            .required()
            .messages({
                'string.pattern.base':
                    'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match'
            })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.createStaffValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required(),
        lastName: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('cashier', 'manager').required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.addProductValidator = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string().trim().min(2).required().messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 2 characters'
        }),
        categoryId: objectIdValidator.required().messages({
            'any.invalid': 'Category ID must be a valid ObjectId',
            'any.required': 'Category ID is required'
        }),
        packageType: Joi.string().trim().required().messages({
            'string.empty': 'Package type is required'
        }),
        packageQuantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Package quantity must be a number',
            'number.min': 'Package quantity must be at least 1',
            'any.required': 'Package quantity is required'
        }),
        unitPerPackage: Joi.number().integer().min(1).required().messages({
            'number.base': 'Units per package must be a number',
            'number.min': 'Units per package must be at least 1',
            'any.required': 'Units per package is required'
        }),
        unitPrice: Joi.number().min(0).required().messages({
            'number.base': 'Unit price must be a number',
            'number.min': 'Unit price cannot be negative',
            'any.required': 'Unit price is required'
        }),
        expiryDate: Joi.date().iso().required().messages({
            'date.base': 'Expiry date must be a valid date',
            'date.format': 'Expiry date must be in ISO format (YYYY-MM-DD)',
            'any.required': 'Expiry date is required'
        }),
        availableStock: Joi.number().integer().min(0).optional().messages({
            'number.base': 'Available stock must be a number',
            'number.min': 'Available stock cannot be negative'
        }),
        backroomStock: Joi.number().integer().min(0).optional().messages({
            'number.base': 'Backroom stock must be a number',
            'number.min': 'Backroom stock cannot be negative'
        })
    }).custom((value, helpers) => {
        const totalIncomingStock = value.packageQuantity * value.unitPerPackage;
        const availableStock = value.availableStock ?? 0;
        const backroomStock = value.backroomStock ?? 0;

        if (value.availableStock !== undefined || value.backroomStock !== undefined) {
            if (availableStock + backroomStock !== totalIncomingStock) {
                return helpers.message(
                    `Initial stock allocation must equal total incoming stock of ${totalIncomingStock} units`
                );
            }
        }

        return value;
    }, 'Stock allocation validation');

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.moveProductsValidator = (req, res, next) => {
    const schema = Joi.object({
        actionType: Joi.string().trim().required().messages({
            'string.empty': 'Action type is required'
        }),
        moveFrom: Joi.string().trim().required().messages({
            'string.empty': 'Move from field is required'
        }),
        moveTo: Joi.string().trim().required().messages({
            'string.empty': 'Move to field is required'
        }),
        quantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Quantity must be a number',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
        })
    }).custom((value, helpers) => {
        if (value.moveFrom.toLowerCase() === value.moveTo.toLowerCase()) {
            return helpers.message('moveFrom and moveTo cannot be the same');
        }

        return value;
    }, 'Move validation');

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
        email: Joi.string().trim().lowercase().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.createSubscriptionPlanValidator = (req, res, next) => {
    const schema = Joi.object({
        subscriptionName: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        billingCycle: Joi.string().valid('monthly', 'yearly').required(),
        maxStaff: Joi.number().min(1).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.contactUsValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().required(),
        email: Joi.string().trim().lowercase().email().required(),
        phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
        message: Joi.string().trim().min(10).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.bookDemoValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(2).required(),
        email: Joi.string().trim().lowercase().email().required(),
        message: Joi.string().trim().min(10).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};
