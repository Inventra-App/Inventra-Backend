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

const validate = (schema, source = 'body') => (req, res, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.signUpValidator = validate(
    Joi.object({
        firstName: Joi.string().trim().min(2).required(),
        lastName: Joi.string().trim().min(2).required(),
        email: Joi.string().email().required(),
        businessName: Joi.string().trim().min(2).required(),
        phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required(),

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
    })
);

exports.verifyUserValidator = validate(
    Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().pattern(/^\d{6}$/).required()
    })
);

exports.resendOtpValidator = validate(
    Joi.object({
        email: Joi.string().email().required()
    })
);

exports.loginValidator = validate(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
);

exports.forgotPasswordValidator = validate(
    Joi.object({
        email: Joi.string().email().required()
    })
);

exports.resetPasswordValidator = validate(
    Joi.object({
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
    })
);

exports.createStaffValidator = validate(
    Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required(),
        lastName: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('cashier', 'manager').required()
    })
);

exports.addProductValidator = validate(
    Joi.object({
        productName: Joi.string().trim().min(2).max(100).required(),
        categoryId: objectIdValidator.required(),
        packageType: Joi.string().required(),
        packageQuantity: Joi.number().min(1).required(),
        unitPerPackage: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
        expiryDate: Joi.date().greater('now').required(),
        supplier: Joi.string().trim().min(2).optional()
    })
);

exports.createCategoryValidator = validate(
    Joi.object({
        categoryName: Joi.string().trim().min(3).max(50).required(),
        description: Joi.string().trim().min(5).max(200).required()
    })
);

exports.moveProductsValidator = validate(
    Joi.object({
        actionType: Joi.string().valid('move').required(),
        moveFrom: Joi.string()
            .valid('all stock', 'available stock', 'reserved stock')
            .required(),
        moveTo: Joi.string()
            .valid('available stock', 'reserved stock')
            .required(),
        quantity: Joi.number().integer().positive().required()
    })
);

exports.recordStockEntryValidator = validate(
    Joi.object({
        productId: objectIdValidator.required(),
        supplier: Joi.string().trim().min(2).required(),
        expiryDate: Joi.date().greater('now').required(),
        packageType: Joi.string().required(),
        packageQuantity: Joi.number().integer().positive().required(),
        unitPerPackage: Joi.number().integer().positive().required()
    })
);

exports.checkoutSaleValidator = validate(
    Joi.object({
        paymentMethod: Joi.string()
            .valid('cash', 'card', 'transfer')
            .required(),

        items: Joi.array()
            .items(
                Joi.object({
                    productId: objectIdValidator.required(),
                    quantity: Joi.number().integer().positive().required()
                })
            )
            .min(1)
            .required()
    })
);

exports.batchIdValidator = validate(
    Joi.object({
        id: objectIdValidator.required()
    }),
    'params'
);

exports.loginStaffValidator = validate(
    Joi.object({
        email: Joi.string().trim().lowercase().email().required(),
        password: Joi.string().required()
    })
);

exports.createSubscriptionPlanValidator = validate(
    Joi.object({
        subscriptionName: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        billingCycle: Joi.string().valid('monthly', 'yearly').required(),
        maxStaff: Joi.number().min(1).required()
    })
);

exports.contactUsValidator = validate(
    Joi.object({
        firstName: Joi.string().trim().required(),
        email: Joi.string().trim().lowercase().email().required(),
        phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required(),
        message: Joi.string().trim().min(10).required()
    })
);