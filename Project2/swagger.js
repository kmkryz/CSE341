const swaggerAutogen = require('swagger-autogen')();

const doc = {
    swagger: "2.0",
    info: {
        title: 'Recipe API',
        description: 'Recipe API Documentation',
        version: '1.0.0'
    },
    host: process.env.NODE_ENV === 'production' 
        ? 'recipe-api-qqxm.onrender.com'
        : 'localhost:8080',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
    securityDefinitions: {
        oauth2: {
            type: 'oauth2',
            flow: 'implicit',
            authorizationUrl: 'https://github.com/login/oauth/authorize',
            scopes: {
                'user:email': 'Read user email address'
            }
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/recipes.js', './routes/users.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);