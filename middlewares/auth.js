const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        console.log(token)
        if (!token) {
            return res.status(401).json({
                message: 'Access denied. Please login again'
            })
        }

        const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
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
}

exports.authenticate = authenticate

  