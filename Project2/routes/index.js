const express = require('express');
const router = express.Router();
const passport = require('passport');

// Home route
router.get('/', (req, res) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Is Authenticated:', req.isAuthenticated());
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Recipe API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .nav-link { margin: 10px 0; }
                .button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to Recipe API</h1>
            ${req.isAuthenticated() 
                ? `
                    <div>
                        <p>Logged in as: ${req.user.username}</p>
                        <div class="nav-link">
                            <a href="/api-docs" class="button">API Documentation</a>
                        </div>
                        <div class="nav-link">
                            <a href="/logout" class="button">Logout</a>
                        </div>
                    </div>
                    `
                : `
                    <div class="nav-link">
                        <a href="/login" class="button">Login with GitHub</a>
                    </div>
                    `
            }
        </body>
        </html>
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
