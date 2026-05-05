const express = require('express');
const cookieParser = require('cookie-parser'); // added for security
const jwt = require('jsonwebtoken'); // addedfor security
const path = require('path');
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser()); // added

app.get('/serviceWorker.js', (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile(path.join(__dirname, 'static/serviceWorker.js'));
});

// Designate the static folder as serving static resources
app.use('/static', express.static(__dirname + '/static')); // added 'static' prefix

const TOKEN_COOKIE_NAME = "EvergreenToken"; // added auth middleware for frontend routes
const SECRET = process.env.API_SECRET_KEY; // added auth middleware for frontend routes

const requireAuth = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE_NAME];
  
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};



/***  public routes (/splash, /register, /login, /login-success) - no auth needed */
/**
 * Splash is the landing page (no auth needed)
 * SPLASH ROUTE: welcome message (splash.html) --> 2 seconds --> login page (login.html)
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/splash.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/register.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/login.html'));
});
app.get('/offline', (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/offline.html'));
});
app.get('/login-success', (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/login-success.html'));
});
/***  protected routes (/plants, /schedule, /profile) -  auth needed */
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/dashboard.html'));
});
/** [EXPLORE PLANTS] page*/
app.get('/plants', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/plants.html'));
});

app.get('/schedule', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/schedule.html'));
});

app.get('/profile', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/profile.html'));
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));