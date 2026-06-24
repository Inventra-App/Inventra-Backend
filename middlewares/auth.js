const staffModel = require("../models/staff")
const SupermarketModel = require("../models/supermarket")
const jwt = require('jsonwebtoken')

exports.authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        console.log(token)
        if (!token) {
            return res.status(401).json({
                message: 'Access denied. Please login again'
            })
        }

        const jwtSecret = process.env.SECRET_KEY;
        if (!jwtSecret) {
            return res.status(500).json({
                message: 'JWT secret is not configured. Please set JWT_SECRET or SECRET_KEY in .env'
            })
        }

        const data = jwt.verify(token, jwtSecret)

        console.log(data)

        if (data.role === 'admin') {
            const supermarket = await SupermarketModel.findById(data.id);

            if (!supermarket) {
                return res.status(401).json({
                    message: 'Supermarket account no longer exists. Please sign up again'
                });
            }

            if (!supermarket.isVerified) {
                return res.status(403).json({
                    message: 'Supermarket account is not verified. Please verify your email'
                });
            }
        }

        if (['manager', 'cashier'].includes(data.role)) {
            const staff = await staffModel.findById(data.id);

            if (!staff) {
                return res.status(401).json({
                    message: 'Staff account no longer exists. Please contact your administrator'
                });
            }

            if (!staff.isActive || !staff.isVerified) {
                return res.status(403).json({
                    message: 'Staff account is not active. Please contact your administrator'
                });
            }
        }

        req.user = data

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Your session has expired. Please login again'
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid session. Please login again'
            })
        }

        res.status(500).json({
            message: 'Something went wrong'
        })
    }
};

exports.staffInvite = async(req,res,next)=>{
    try {
      const {token} = req.params

    if(!token){
        return res.status(400).json({
            message: 'auth required'
        })
    }

     await jwt.verify(token, process.env.JWT_SECRET_INVITE, async(error, result)=>{
        if(error){
            return next({
                message: error.message,
                statusCode: 400
            })
        };
        
        const findStaff = await staffModel.findById(result.id)
        if(!findStaff){
            return next({
                message: 'staff does not exist',
                statusCode: 404
            })
        }

        const role = findStaff.role

        if (role !== 'staff'){
            return next({
                message: 'unauthorized access',
                statusCode: 403
            })
        }
        req.user = result

        next()
        
    })
    } catch (error) {
     next(error)
    }
};


  
