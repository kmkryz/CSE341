const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Recipe API',
        description: 'Recipe API Documentation',
    },
    host: process.env.NODE_ENV === 'production' 
        ? 'recipe-api-qqxm.onrender.com'  // Replace with your actual Render.com URL
        : 'localhost:8080',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/recipes.js', './routes/users.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);