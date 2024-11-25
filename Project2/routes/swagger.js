const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json'); // Adjust the path if needed

// Serve Swagger UI
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;