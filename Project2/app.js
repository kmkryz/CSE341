const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const port = process.env.PORT || 8080;
const app = express();

// Configure Passport first
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/github/callback"  // Match this exactly with GitHub OAuth settings
}, function(accessToken, refreshToken, profile, done) {
  console.log('GitHub Profile:', profile); // Debug log
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user); // Debug log
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing user:', user); // Debug log
  done(null, user);
});

// Configure middleware
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, //set to true if using https
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

// Debug middleware
app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());
  next();
});

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);
app.use('/', indexRoutes);

// Home route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Recipe API</h1>
    ${req.isAuthenticated() 
      ? `<p>Logged in as ${req.user.username}</p>
         <a href="/logout">Logout</a>
         <p><a href="/api-docs">API Documentation</a></p>`
      : `<p><a href="/login">Login with GitHub</a></p>`
    }
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Initialize database and start server
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

startServer();

app.get('/auth/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/login',
        session: true  // Explicitly enable session
    }),
    (req, res) => {
        // Log successful authentication
        console.log('Authentication successful, session:', req.session);
        console.log('User:', req.user);
        res.redirect('/');
    }
);