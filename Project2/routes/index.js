const express = require('express');
const router = express.Router();
const passport = require('passport');

// Home page route
router.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to Recipe API</h1>
        ${req.user 
            ? `<p>Logged in as ${req.user.username}</p>
               <a href="/logout">Logout</a>`
            : `<a href="/login">Login with GitHub</a>`
        }
    `);
});

// Login route
router.get('/login', passport.authenticate('github', { 
    scope: ['user:email']
}));

// GitHub callback route
router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        console.log('Auth successful, user:', req.user);
        res.redirect('/');
    }
);

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
