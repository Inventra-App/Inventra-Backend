require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/documentation');

const express = require('express');
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');




const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/v1', userRoutes)


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong'
    });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log(`Database is connected Sucessfully`)
        app.listen(PORT, () => {    
            console.log(`App is listening on PORT:${PORT}`)
        })
    })
    .catch((error)=>{
        console.log(`Unable to connect: `, error.message)
    }) 