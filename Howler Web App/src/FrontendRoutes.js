const express = require('express');
const frontendRouter = express.Router();
const path = require('path');
const { TokenMiddleware } = require('./middleware/TokenMiddleware');

// auth routes
frontendRouter.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/register.html'));
});


frontendRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/login.html'));
});


// user routes
frontendRouter.get('/profile', TokenMiddleware, (req, res) => {
    res.redirect(`/profile/${req.user.username}`);
});

frontendRouter.get('/profile/:username', TokenMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/profile.html'));
});


frontendRouter.get('/following', TokenMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/following.html'));
});



// howl routes
frontendRouter.get('/howl/new', TokenMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/howlPost.html'));
});


frontendRouter.get('/howl/:id', TokenMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/howl.html'));
});


frontendRouter.get('/feed', TokenMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/feed.html'));
});


// error route
frontendRouter.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, `../templates/error.html`));
});

module.exports = frontendRouter;