const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);
require('./middleware/authenticate');
require('dotenv').config();
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const port = process.env.PORT || 8080;
const app = express();

// Add environment variable validation
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.warn('GitHub OAuth credentials not found in environment variables');
}

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

// Configure Passport first
const isDevelopment = process.env.NODE_ENV !== 'production';
const BASE_URL = isDevelopment 
    ? 'http://localhost:8080'
    : 'https://cse341-winter24-rd6a.onrender.com';

    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production'
          ? 'https://cse341-winter24-rd6a.onrender.com/auth/github/callback'
          : 'http://localhost:8080/auth/github/callback'
  }, function(accessToken, refreshToken, profile, done) {
      console.log('GitHub profile:', profile);
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

// Create MongoDB store
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 // 24 hours
});

// Catch errors
store.on('error', function(error) {
    console.log('Session store error:', error);
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'lax'
    },
    name: 'sessionId'
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
  origin: isDevelopment ? 'http://localhost:8080' : 'https://cse341-winter24-rd6a.onrender.com',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true
}));

// Debug middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Is Authenticated:', req.isAuthenticated());
  }
  next();
});

app.use('/', indexRoutes);


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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});



startServer();

