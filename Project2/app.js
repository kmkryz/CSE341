const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const indexRoutes = require('./routes/index');

// Initialize express app
const app = express();
const port = process.env.PORT || 8080;

// Environment setup
const isDevelopment = process.env.NODE_ENV !== 'production';
const BASE_URL = isDevelopment 
    ? 'http://localhost:8080'
    : 'https://cse341-winter24-rd6a.onrender.com';

// Environment variable validation
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.warn('GitHub OAuth credentials not found in environment variables');
}

// 1. Basic middleware
app.use(bodyParser.json());

// 2. CORS configuration
app.use(cors({
    origin: isDevelopment ? 'http://localhost:8080' : 'https://cse341-winter24-rd6a.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}));

// 3. Session store setup
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 // 24 hours
});

store.on('error', function(error) {
    console.log('Session store error:', error);
});

// 4. Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    },
    name: 'sessionId',
    proxy: process.env.NODE_ENV === 'production'
}));

// Add trust proxy configuration
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}

// 5. Passport configuration
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
    console.log('Serializing user:', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user);
    done(null, user);
});

// 6. Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// 7. Debug middleware
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Session:', req.session);
        console.log('User:', req.user);
        console.log('Is Authenticated:', req.isAuthenticated());
    }
    next();
});

// 8. Routes
require('./middleware/authenticate'); // Authentication middleware
app.use('/', indexRoutes);

// 9. OAuth callback route
app.get('/auth/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/login',
        session: true
    }),
    (req, res) => {
        if (!req.user) {
            console.error('Authentication successful but no user object');
            return res.redirect('/login');
        }
        console.log('Authentication successful, session:', req.session);
        console.log('User:', req.user);
        res.redirect('/');
    }
);

// 10. Error handling middleware (should be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// 11. Database connection and server startup
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

