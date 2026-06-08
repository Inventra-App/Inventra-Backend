const jwt = require('jsonwebtoken')

exports.authentication = async(req, res, next)=>{
    try {
        const token =  req.headers.authorization?.split(" ")[1]
        console.log(token)
        if(!token){
            return res.status(401).json({
                message: 'Access denied. Please login again'
            })
        }

        const data = jwt.verify(token, process.env.SECRET_KEY)
        req.user = data
        next()
    
    } 
    catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                message: 'Your session has expired. Please login again'
            })
        }

        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                message: 'Invalid session. Please login again'
            })
        }

        res.status(500).json({
            message: 'Something went wrong'
        })
        
    }
}