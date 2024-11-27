const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const MongoStore = require('connect-mongo');
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
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60, // 1 day
        autoRemove: 'native',
        touchAfter: 24 * 3600 // time period in seconds
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    },
    name: 'sessionId'
}));

// Add trust proxy configuration
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}

// 5. Passport configuration
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/github/callback`
}, function(accessToken, refreshToken, profile, done) {
    console.log('GitHub strategy callback');
    console.log('Profile:', profile);
    console.log('Access Token:', accessToken);
    
    // Store the access token in the user profile
    profile.accessToken = accessToken;
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user:', id);
    try {
        // If you're storing users in MongoDB, fetch from there
        // const user = await User.findById(id);
        // For now, we'll create a simple user object
        const user = {
            id: id,
            username: 'kmkryz' // You might want to store this in session during serialize
        };
        done(null, user);
    } catch (err) {
        console.error('Deserialization error:', err);
        done(err, null);
    }
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
        session: true,
        failureMessage: true
    }),
    (req, res) => {
        console.log('GitHub authentication completed');
        console.log('Session ID:', req.sessionID);
        
        // Force session save
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect('/login');
            }
            
            // Log the session after save
            console.log('Session after save:', req.session);
            console.log('User after save:', req.user);
            console.log('isAuthenticated:', req.isAuthenticated());
            
            res.redirect('/');
        });
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

