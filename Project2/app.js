const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');

const port = process.env.PORT || 8080;
const app = express();

// Initialize database before starting server
const startServer = async () => {
  try {
    await mongodb.initDb();
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

// Root route
app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
  
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  })
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  .use('/recipes', recipeRoutes)
  .use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start the server
startServer();