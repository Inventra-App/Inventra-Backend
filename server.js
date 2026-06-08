const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 7878;
// const rateLimiter = require('./middlewares/rateLimiter')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const supermarketRoutes = require('./routes/supermarketRoutes');
const subscriptionPlanRoutes = require('./routes/subscriptionPlanRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const staffRoutes = require('./routes/staffRoutes')
const express_session= require('express-session')
const { passport } = require('./middlewares/passport')
const cors = require('cors');


const app = express();

app.use(express_session({
    secret: 'Oshio-Ella',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(express.json());
app.use('/api/v1', supermarketRoutes);
app.use('/api/v1', subscriptionPlanRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', staffRoutes);
// app.use(rateLimiter);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Inventra API Documentation',
        version: '2.0.0',
        description: `This is a REST API application made with Express.
                      The base Url is: http://localhost:7878/api/v1`,
        license: {
            name: 'Official Url',
            url: 'https://google.com',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:7878', 
            description: 'Development server',
        },
        {
          url: 'https://inventra-backend-212y.onrender.com/',
          description: 'Live server'
        }
    ],
    security: [{ bearerAuth: [] }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 


    app.use((err, req, res, next) => {
          if (err.name === 'MulterError') {
          return res.status(400).json({ 
          message: 'File upload failed' });
    }
    if (err.name === 'JsonWebTokenError') { 
    return res.status(401).json({
           message: 'Session expired, please login again' });
    }
    res.status(err.statusCode || 500).json({ 
      message: err.message }); 
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
    })
    .catch((error) => {
        console.log('Unable to connect: ', error.message);
    });