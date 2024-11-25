const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe Management API',
      version: '1.0.0',
      description: 'API for managing recipes and users',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local Development Server',
      },
      {
        url: 'https://cse341-winter24-rd6a.onrender.com',
        description: 'Production Server',
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
