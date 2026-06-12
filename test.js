

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
        password: joi.string().min(6).max(20).pattern(/^(?=.*[A-Z])(?=.*\d)/).required().messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters',
                'string.max': 'Password must not exceed 20 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
                'any.required': 'Password is required'
            }),
        role: joi.string().valid('sales', 'manager').required().messages({
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