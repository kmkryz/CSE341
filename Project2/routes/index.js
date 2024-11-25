const express = require('express');
const router = express.Router();
const passport = require('passport');

// Use sub-routers for different routes
router.use('/api-docs', require('./swagger'));
router.use('/recipes', require('./recipes'));
router.use('/users', require('./users'));

// Home route
router.get('/', (req, res) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Is Authenticated:', req.isAuthenticated());
    
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

// Login route
router.get('/login', passport.authenticate('github', { 
    scope: ['user:email']
}));

// GitHub callback route
router.get('/auth/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true
    })
);

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
