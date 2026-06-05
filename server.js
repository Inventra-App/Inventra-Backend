require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// const rateLimiter = require('./middleware/rateLimiter');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const PORT = process.env.PORT || 7878;
const cors = require('cors');
const app = express();
app.use(cors({origin:'*'}))
app.use(express.json());
app.use('/api/v1/users', userRoutes);
// app.use(rateLimiter);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Inventra API Documentation',
    version: '2.0.0',
    description:
      `This is a REST API application made with Express. It retrieves data from JSONPlaceholder.
       The base Url is:http://localhost:7878`,
    license: {
      name: 'Official Url',
      url: 'http://google.com',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'https://localhost:7878',
      description: 'Development server',
    },
  ],
  security:[
  {
    bearerAuth:[]
  }
],

components: {
  securitySchemes:{
    bearerAuth:{
      type:'http',
      scheme:'bearer',
      bearerFormat:'JWT'
    }
  }
}
};




const options ={
    swaggerDefinition,
    apis:['./routes/*.js']
}
 const swaggerSpec = swaggerJsdoc(options)

 app.use('/api/v1/documention',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

//  api.use('/api/v2/documentions',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use((req,res,next)=>{

})


app.use((err,req,res,next)=>{
    if(err.name === 'MulterError'){
        return res.status(400).json({
            message:'file upload failed'
        })
    }
    if (err.name === 'JsonwebTokenError'){
        return res.status(400).json({
            message:'session expired,please login again'
        })
    }
    res.status(500).json({
        message:err.message
    })
})



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database is connected successfully');
    app.listen(PORT, () => {
      console.log(`App is listening on PORT:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Unable to connect: ', error.message);
  });
