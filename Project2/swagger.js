const swaggerAutogen = require('swagger-autogen')();

const doc = {
    openapi: '3.0.0',
    info: {
        title: 'Recipe API',
        description: 'Recipe API Documentation',
        version: '1.0.0'
    },
    servers: [
        {
            url: process.env.NODE_ENV === 'production'
                ? 'https://cse341-winter24-rd6a.onrender.com'
                : 'http://localhost:8080',
            description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            oauth2: {
                type: 'oauth2',
                flows: {
                    implicit: {
                        authorizationUrl: 'https://github.com/login/oauth/authorize',
                        scopes: {
                            'user:email': 'Read user email address'
                        }
                    }
                }
            }
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/recipes.js', './routes/users.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);