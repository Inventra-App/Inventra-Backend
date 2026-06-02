const swagger = require('swagger-jsdoc')

const option = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Creating a doc for Inventra',
            description: 'Backend doc for Inventra App',
            version: '1.0'
        },
        servers: [
            {
                url: 'http://localhost:1002',
                description: 'Local development server'
            }
        ],
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        } 
    },
    apis: [
        './docs/user.yaml'
    ]
}

module.exports = swagger(option)