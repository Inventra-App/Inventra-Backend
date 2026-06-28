const staffModel = require("../models/staff")
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

// exports.staffInvite = async(req,res,next)=>{
//     try {
//       const {token} = req.params

//     if(!token){
//         return res.status(400).json({
//             message: 'auth required'
//         })
//     }

//      await jwt.verify(token, process.env.JWT_SECRET_INVITE, async(error, result)=>{
//         if(error){
//             return next({
//                 message: error.message,
//                 statusCode: 400
//             })
//         };
        
//         const findStaff = await staffModel.findById(result.id)
//         if(!findStaff){
//             return next({
//                 message: 'staff does not exist',
//                 statusCode: 404
//             })
//         }

//         const role = findStaff.role

//         if (role !== 'staff'){
//             return next({
//                 message: 'unauthorized access',
//                 statusCode: 403
//             })
//         }
//         req.user = result

//         next()
        
//     })
//     } catch (error) {
//      next(error)
//     }
// };


  
/**
 * Role-based authorization middleware (factory)
 * Returns a middleware that checks if req.user.role is in the allowed roles.
 * Must be used AFTER the `authentication` middleware.
 *
 * @param  {...string} allowedRoles - One or more roles permitted to access the route
 * @returns {function} Express middleware
 *
 * @example
 *   // Only admin
 *   router.get('/admin-only', authentication, authorize('admin'), handler);
 *
 *   // Admin or Manager
 *   router.post('/product', authentication, authorize('admin', 'manager'), handler);
 *
 *   // Admin or Cashier
 *   router.post('/pos/sale', authentication, authorize('admin', 'cashier'), handler);
 */
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Authentication required. Please login first.'
                });
            }

            const { role } = req.user;

            if (!role) {
                return res.status(403).json({
                    message: 'User role not found. Access denied.'
                });
            }

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    message: `You are not authorised to perform this action. Required role(s): ${allowedRoles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: 'Authorization check failed. Please try again.'
            });
        }
    };
};

/**
 * Convenience shorthands for common role combinations
 * These are pre-configured authorize() middlewares for quick use.
 */

/** Admin only */
exports.adminOnly = exports.authorize('admin');

/** Admin or Manager */
exports.adminManager = exports.authorize('admin', 'manager');

/** Admin or Cashier */
exports.adminCashier = exports.authorize('admin', 'cashier');

/** Manager only */
exports.managerOnly = exports.authorize('manager');

/** Cashier only */
exports.cashierOnly = exports.authorize('cashier');

/** Staff only (manager or cashier) — excludes admin */
exports.staffOnly = exports.authorize('manager', 'cashier');

