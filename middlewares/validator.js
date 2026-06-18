const Joi = require('joi');
const mongoose = require('mongoose');

const passwordPattern =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

exports.signUpValidator = (req, res, next) => {
    const signUpSchema = Joi.object({
        firstName: Joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required(),
        lastName: Joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required(),
        email: Joi.string().email().required(),
        businessName: Joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required(),
        phoneNumber: Joi.string().trim().pattern(/^[0-9]{10,15}$/).required(),

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

    const { error } = signUpSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.verifyUserValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().pattern(/^[0-9]{6}$/).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.resendOtpValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.loginValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.forgotPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.resetPasswordValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),

        password: Joi.string()
            .pattern(passwordPattern)
            .required(),

        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.createStaffValidator = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().trim().min(2).max(50).required().messages({
                'string.empty': 'First name is required',
                'string.min': 'First name must be at least 2 characters',
                'string.max': 'First name must not exceed 50 characters',
                'any.required': 'First name is required'
            }),
        lastName: joi.string().trim().min(2).max(50).required().messages({
                'string.empty': 'Last name is required',
                'string.min': 'Last name must be at least 2 characters',
                'string.max': 'Last name must not exceed 50 characters',
                'any.required': 'Last name is required'
            }),

        email: joi.string().email().required().messages({
            'any required':'Email is required',
            'string.empty':'Email cannot be Empty',
            'string.email':'Email must be a valid email',
            }),
            
        role: joi.string().valid('cashier', 'manager').required().messages({
                'string.empty': 'Role is required',
                'any.only': 'Role must be either cashier or manager',
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

exports.addProductValidator = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string().trim().min(2).max(100).required(),

        categoryId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.isValidObjectId(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            })
            .required(),

        packageType: Joi.string().required(),
        packageQuantity: Joi.number().min(1).required(),
        unitPerPackage: Joi.number().min(1).required(),
        unitPrice: Joi.number().min(0).required(),
        expiryDate: Joi.date().greater('now').required(),
        supplier: Joi.string().trim().allow('').optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.createCategoryValidator = (req, res, next) => {
    const schema = Joi.object({
        categoryName: Joi.string().trim().pattern(/^[A-Za-z\s]{3,50}$/).required(),
        description: Joi.string().trim().min(5).max(200).required()
    });

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
        actionType: Joi.string().required(),
        moveFrom: Joi.string().valid('all stock', 'available stock', 'reserved stock').required(),
        moveTo: Joi.string().valid('available stock', 'reserved stock').required(),
        quantity: Joi.number().integer().positive().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

exports.recordStockEntryValidator = (req, res, next) => {
    const schema = Joi.object({
        productId: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.isValidObjectId(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            })
            .required(),

        supplier: Joi.string().trim().min(2).required(),
        expiryDate: Joi.date().greater('now').required(),
        packageType: Joi.string().required(),
        packageQuantity: Joi.number().integer().positive().required(),
        unitPerPackage: Joi.number().integer().positive().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.checkoutSaleValidator = (req, res, next) => {
    const schema = Joi.object({
        paymentMethod: Joi.string()
            .valid('cash', 'card', 'transfer')
            .required(),

        items: Joi.array()
            .items(
                Joi.object({
                    productId: Joi.string()
                        .custom((value, helpers) => {
                            if (!mongoose.isValidObjectId(value)) {
                                return helpers.error('any.invalid');
                            }
                            return value;
                        })
                        .required(),

                    quantity: Joi.number().integer().positive().required()
                })
            )
            .min(1)
            .required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.batchIdValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string()
            .custom((value, helpers) => {
                if (!mongoose.isValidObjectId(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            })
            .required()
    });

    const { error } = schema.validate(req.params);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

exports.loginStaffValidator = (req, res, next) => {
    const schema = joi.object({
        username: joi.string().trim().required().messages({
                'string.empty': 'Username is required',
                'any.required': 'Username is required'
            }),
        password: joi.string()
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


exports.createSubscriptionPlanValidator = (req, res, next) => {
    const schema = Joi.object({
        subscriptionName: Joi.string().trim().required().messages({
                'string.empty': 'Subscription name is required',
                'any.required': 'Subscription name is required'
            }),
        
        price: Joi.number().min(0).required().messages({
                'number.base': 'Price must be a number',
                'number.min': 'Price must be at least 0',
                'any.required': 'Price is required'
            }),

        billingCycle: Joi.string().trim().valid('monthly', 'yearly').required().messages({
                'any.only': 'Billing cycle must be either monthly or yearly',
                'string.empty': 'Billing cycle is required',
                'any.required': 'Billing cycle is required'
            }),

        maxStaff: Joi.number().min(1).required().messages({
                'number.base': 'Max staff must be a number',
                'number.min': 'Max staff must be at least 1',
                'any.required': 'Max staff is required'
            })
    });

    const { error } = schema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};


exports.contactUsValidator = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().required().messages({
                'string.empty': 'First name is required',
                'any.required': 'First name is required'
            }),

        email: Joi.string().trim().lowercase().email().required().messages({
                'string.email': 'Email must be a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),

        phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required().messages({
                'string.pattern.base': 'Phone number must be between 10 and 15 digits',
                'string.empty': 'Phone number is required',
                'any.required': 'Phone number is required'
            }),

        message: Joi.string().trim().min(10).required().messages({
                'string.empty': 'Message is required',
                'string.min': 'Message must be at least 10 characters',
                'any.required': 'Message is required'
            })
    });

    const { error } = schema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};



// exports.loginStaffValidator = (req, res, next) => {
//     const schema = joi.object({
//         username: joi.string().trim().required().messages({
//                 'string.empty': 'Username is required',
//                 'any.required': 'Username is required'
//             }),
//         password: joi.string()
//             .required()
//             .messages({
//                 'string.empty': 'Password is required',
//                 'any.required': 'Password is required'
//             }),
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }
//     next();
// };




// const Joi = require('joi');
// const mongoose = require('mongoose');
// const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// exports.signUpValidator = (req, res, next) => {
//     const signUpSchema = joi.object({
//         firstName: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
//             'any.required': 'First Name is required',
//             'string.empty':'First Name cannot be Empty',
//             'string.pattern.base': 'First Name cannot contain numbers and must be atleast 4 characters'
//         }),
//         lastName: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
//             'any.required': 'Last Name is required',
//             'string.empty':'Last Name cannot be Empty',
//             'string.pattern.base': 'Last Name cannot contain numbers and must be atleast 4 characters'
//         }),
//         email: joi.string().email().required().messages({
//             'any.required':'Email is required',
//             'string.empty':'Email cannot be Empty',
//             'string.email':'Email must be a valid email',
//         }),
//         businessName: joi.string().trim().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
//             'any.required': 'Business Name is required',
//             'string.empty':'Business Name cannot be Empty',
//             'string.pattern.base': 'Business Name cannot contain numbers and must be atleast 4 characters'
//         }),
//         phoneNumber: joi.string().trim().pattern(/^[0-9]{10,15}$/).required().messages({
//             'any.required':'Phone Number is required',
//             'string.empty':'Phone Number cannot be Empty',
//             'string.pattern.base':'Phone Number must be between 10 , 15 digits'
//         }),
//         password: joi.string()
//         .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
//         .required()
//         .messages({
//             'any.required': 'Password is required',
//             'string.empty': 'Password cannot be empty',
//             'string.pattern.base': 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
//             }),

//         confirmPassword: joi.string()
//         .valid(joi.ref('password'))
//         .required()
//         .messages({
//             'any.required': 'Please confirm password',
//             'string.empty': 'Please confirm password',
//             'any.only': 'Passwords do not match'
//         })
//     })

//     const { error }= signUpSchema.validate(req.body)
//     if(error) {
//         return res.status(400).json({
//             message:error.details[0].message
//         })
//     }
//     next()
// }

// exports.verifyUserValidator = (req, res, next) => {
//     const schema = joi.object({
//         email: joi.string().trim().email().required().messages({
//             'string.email': 'Please enter a valid email',
//             'string.empty': 'Email is required',
//             'any.required': 'Email is required'
//         }),
//         otp: joi.string().pattern(/^[0-9]{6}$/).required().messages({
//         'string.empty': 'OTP is required',
//         'string.pattern.base': 'OTP must be exactly 6 digits',
//         'any.required': 'OTP is required'
// })
//     })

//     const { error } = schema.validate(req.body)
//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         })
//     }
//     next()
// }

// exports.resendOtpValidator = (req, res, next) => {
//     const schema = joi.object({
//         email: joi.string().trim().email().required().messages({
//             'string.email': 'Please enter a valid email',
//             'string.empty': 'Email is required',
//             'any.required': 'Email is required'
//         })
//     })

//     const { error } = schema.validate(req.body)
//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         })
//     }
//     next()
// }

// exports.loginValidator = (req, res, next) => {
//     const schema = joi.object({
//         email: joi.string().trim().email().required().messages({
//             'string.email': 'Please enter a valid email',
//             'string.empty': 'Email is required',
//             'any.required': 'Email is required'
//         }),
//         password: joi.string().required().messages({
//             'string.empty': 'Password is required',
//             'any.required': 'Password is required'
//         })
//     })

//     const { error } = schema.validate(req.body)
//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         })
//     }
//     next()
// }

// exports.forgotPasswordValidator = (req, res, next) => {
//     const schema = joi.object({
//         email: joi.string().trim().email().required().messages({
//             'string.email': 'Please enter a valid email',
//             'string.empty': 'Email is required',
//             'any.required': 'Email is required'
//         })
//     })

//     const { error } = schema.validate(req.body)
//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         })
//     }
//     next()
// }

// exports.resetPasswordValidator = (req, res, next) => {
//     const schema = joi.object({
//         email: joi.string().trim().lowercase().email().required().messages({
//             'string.email': 'Please enter a valid email',
//             'string.empty': 'Email is required',
//             'any.required': 'Email is required'
//         }),

//         password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/).required().messages({
//             'any.required': 'Password is required',
//             'string.empty': 'Password cannot be empty',
//             'string.pattern.base':'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
//         }),

//         confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
//             'any.only': 'Passwords do not match',
//             'string.empty': 'Confirm password is required',
//             'any.required': 'Confirm password is required'
//         })
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         });
//     }

//     next();
// };

// exports.createStaffValidator = (req, res, next) => {
//     const schema = joi.object({
//         firstName: joi.string().trim().pattern(/^[A-Za-z\s]{2,50}$/).required().messages({
//                 'string.empty': 'First name is required',
//                 'string.pattern.base': 'First name must contain only letters and be between 2 and 50 characters',
//                 'any.required': 'First name is required'
//             }),

//         lastName: joi.string().trim().pattern(/^[A-Za-z\s]{2,50}$/).required().messages({
//                 'string.empty': 'Last name is required',
//                 'string.pattern.base': 'Last name must contain only letters and be between 2 and 50 characters',
//                 'any.required': 'Last name is required'
//             }),

//         email: joi.string().trim().lowercase().email().required().messages({
//                 'any.required': 'Email is required',
//                 'string.empty': 'Email cannot be empty',
//                 'string.email': 'Email must be a valid email',
//             }),

//         role: joi.string().trim().lowercase().valid('sales', 'manager').required().messages({
//                 'string.empty': 'Role is required',
//                 'any.only': 'Role must be either sales or manager,',
//                 'any.required': 'Role is required'
//             }),
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };

// exports.loginStaffValidator = (req, res, next) => {
//     const schema = joi.object({
//         username: joi.string().trim().required().messages({
//                 'string.empty': 'Username is required',
//                 'any.required': 'Username is required'
//             }),
//         password: joi.string()
//             .required()
//             .messages({
//                 'string.empty': 'Password is required',
//                 'any.required': 'Password is required'
//             }),
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }
//     next();
// };



// exports.addProductValidator = (req, res, next) => {
//     const schema = Joi.object({
//         productName: Joi.string().trim().min(2).max(100).required().messages({
//                 'string.empty': 'Product name is required',
//                 'string.min': 'Product name must be at least 2 characters',
//                 'string.max': 'Product name must not exceed 100 characters',
//                 'any.required': 'Product name is required'
//             }),

//         categoryId: Joi.objectId().required().messages({
//                 'string.pattern.name': 'Invalid category ID format',
//                 'any.required': 'Category ID is required'
//             }),

//         packageType: Joi.string().trim().required().messages({
//                 'string.empty': 'Package type is required',
//                 'any.required': 'Package type is required'
//             }),

//         packageQuantity: Joi.number().min(1).required().messages({
//                 'number.base': 'Package quantity must be a number',
//                 'number.min': 'Package quantity must be at least 1',
//                 'any.required': 'Package quantity is required'
//             }),

//         unitPerPackage: Joi.number().min(1).required().messages({
//                 'number.base': 'Unit per package must be a number',
//                 'number.min': 'Unit per package must be at least 1',
//                 'any.required': 'Unit per package is required'
//             }),

//         unitPrice: Joi.number().min(0).required().messages({
//                 'number.base': 'Unit price must be a number',
//                 'number.min': 'Unit price must be at least 0',
//                 'any.required': 'Unit price is required'
//             }),

//         expiryDate: Joi.date().greater('now').required().messages({
//                 'date.base': 'Expiry date must be a valid date',
//                 'date.greater': 'Expiry date must be a future date',
//                 'any.required': 'Expiry date is required'
//             }),

//         supplier: Joi.string().trim().allow('').optional().messages({
//                 'string.base': 'Supplier must be a string'
//             }),
//     });

//     const { error } = schema.validate(req.body, {
//         abortEarly: false
//     });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };



// exports.createCategoryValidator = (req, res, next) => {
//     const schema = Joi.object({
//         categoryName: Joi.string().trim().pattern(/^[A-Za-z\s]{3,50}$/).required().messages({
//                 'string.empty': 'Category name is required',
//                 'string.pattern.base': 'Category name must contain only letters and be between 3 and 50 characters',
//                 'any.required': 'Category name is required'
//             }),

//         description: Joi.string().trim().min(5).max(200).required().messages({
//                 'string.empty': 'Description is required',
//                 'string.min': 'Description must be at least 5 characters',
//                 'string.max': 'Description cannot exceed 200 characters',
//                 'any.required': 'Description is required'
//             })
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };



// exports.createSubscriptionPlanValidator = (req, res, next) => {
//     const schema = Joi.object({
//         subscriptionName: Joi.string().trim().required().messages({
//                 'string.empty': 'Subscription name is required',
//                 'any.required': 'Subscription name is required'
//             }),
        
//         price: Joi.number().min(0).required().messages({
//                 'number.base': 'Price must be a number',
//                 'number.min': 'Price must be at least 0',
//                 'any.required': 'Price is required'
//             }),

//         billingCycle: Joi.string().trim().valid('monthly', 'yearly').required().messages({
//                 'any.only': 'Billing cycle must be either monthly or yearly',
//                 'string.empty': 'Billing cycle is required',
//                 'any.required': 'Billing cycle is required'
//             }),

//         maxStaff: Joi.number().min(1).required().messages({
//                 'number.base': 'Max staff must be a number',
//                 'number.min': 'Max staff must be at least 1',
//                 'any.required': 'Max staff is required'
//             })
//     });

//     const { error } = schema.validate(req.body, {
//         abortEarly: false
//     });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };

// exports.contactUsValidator = (req, res, next) => {
//     const schema = Joi.object({
//         firstName: Joi.string().trim().required().messages({
//                 'string.empty': 'First name is required',
//                 'any.required': 'First name is required'
//             }),

//         email: Joi.string().trim().lowercase().email().required().messages({
//                 'string.email': 'Email must be a valid email address',
//                 'string.empty': 'Email is required',
//                 'any.required': 'Email is required'
//             }),

//         phoneNumber: Joi.string().pattern(/^\d{10,15}$/).required().messages({
//                 'string.pattern.base': 'Phone number must be between 10 and 15 digits',
//                 'string.empty': 'Phone number is required',
//                 'any.required': 'Phone number is required'
//             }),

//         message: Joi.string().trim().min(10).required().messages({
//                 'string.empty': 'Message is required',
//                 'string.min': 'Message must be at least 10 characters',
//                 'any.required': 'Message is required'
//             })
//     });

//     const { error } = schema.validate(req.body, {
//         abortEarly: false
//     });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };

// exports.moveProductsValidator = (req, res, next) => {
//     const schema = Joi.object({
//         actionType: Joi.string().required(),

//         moveFrom: Joi.string()
//             .valid('all stock', 'available stock', 'reserved stock')
//             .required(),

//         moveTo: Joi.string()
//             .valid('available stock', 'reserved stock')
//             .required(),

//         quantity: Joi.number()
//             .integer()
//             .positive()
//             .required()
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         });
//     }

//     next();
// };

// exports.recordStockEntryValidator = (req, res, next) => {
//     const schema = Joi.object({
//         productId: Joi.string()
//             .custom((value, helpers) => {
//                 if (!mongoose.isValidObjectId(value)) {
//                     return helpers.error('any.invalid');
//                 }
//                 return value;
//             })
//             .required()
//             .messages({
//                 'string.empty': 'Product ID is required',
//                 'any.required': 'Product ID is required',
//                 'any.invalid': 'Invalid product ID format'
//             }),

//         supplier: Joi.string()
//             .trim()
//             .min(2)
//             .required()
//             .messages({
//                 'string.empty': 'Supplier is required',
//                 'string.min': 'Supplier name must be at least 2 characters',
//                 'any.required': 'Supplier is required'
//             }),

//         expiryDate: Joi.date()
//             .greater('now')
//             .required()
//             .messages({
//                 'date.base': 'Expiry date must be a valid date',
//                 'date.greater': 'Expiry date must be a future date',
//                 'any.required': 'Expiry date is required'
//             }),

//         packageType: Joi.string()
//             .trim()
//             .required()
//             .messages({
//                 'string.empty': 'Package type is required',
//                 'any.required': 'Package type is required'
//             }),

//         packageQuantity: Joi.number()
//             .integer()
//             .positive()
//             .required()
//             .messages({
//                 'number.base': 'Package quantity must be a number',
//                 'number.positive': 'Package quantity must be greater than zero',
//                 'any.required': 'Package quantity is required'
//             }),

//         unitPerPackage: Joi.number().integer().positive()
//             .required()
//             .messages({
//                 'number.base': 'Unit per package must be a number',
//                 'number.positive': 'Unit per package must be greater than zero',
//                 'any.required': 'Unit per package is required'
//             }),
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };
// exports.checkoutSaleValidator = (req, res, next) => {
//     const schema = Joi.object({
//         paymentMethod: Joi.string() .valid('cash', 'card', 'transfer').required().messages({
//                 'any.only': 'Payment method must be cash, card or transfer',
//                 'string.empty': 'Payment method is required',
//                 'any.required': 'Payment method is required'
//             }),

//         items: Joi.array().items(Joi.object({
//                     productId: Joi.string().custom((value, helpers) => {
//             if (!mongoose.isValidObjectId(value)) {
//             return helpers.error('any.invalid');
//             }
//             return value;
//             })
//             .required()
//             .messages({
//             'string.empty': 'Product ID is required',
//             'any.required': 'Product ID is required',
//             'any.invalid': 'Invalid product ID format'
//                 }),
//             quantity: Joi.number().integer().positive().required().messages({
//             'number.base': 'Quantity must be a number',
//             'number.positive': 'Quantity must be greater than zero',
//             'any.required': 'Quantity is required'
//                         })
//                 })
//             ).min(1).required().messages({
//                 'array.min': 'At least one product is required',
//                 'any.required': 'Items are required'
//             })
//     });

//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//         return res.status(400).json({
//             message: error.details.map(err => err.message)
//         });
//     }

//     next();
// };




// exports.batchIdValidator = (req, res, next) => {
//     const schema = Joi.object({
//         id: Joi.string()
//             .custom((value, helpers) => {
//                 if (!mongoose.isValidObjectId(value)) {
//                     return helpers.error('any.invalid');
//                 }
//                 return value;
//             })
//             .required()
//             .messages({
//                 'any.invalid': 'Invalid batch ID format',
//                 'string.empty': 'Batch ID is required',
//                 'any.required': 'Batch ID is required'
//             })
//     });

//     const { error } = schema.validate(req.params);
//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         });
//     }
//     next();
// };
