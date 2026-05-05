const express = require('express'); 
const UserDAO = require('../db/UserDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');

const router = express.Router();
/**
 * [quick notes]:
 * 
 * 409 -> duplicate error
 * 401 -> invalid error
 * 
 * UserDAO.createUser() --> does password hashing
 * 
 * ENDPOINTS:
 * POST /auth/register -create a new user account
 * POST /auth/login - user login
 * POST /auth/logout - user logout
 */

/**
 * POST /auth/register -create a new user account
 * --> created user in db -> generates token -> sets cookie -> returns user data
 */
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    UserDAO.createUser({ username, email, password })
        .then(user => {
            TokenMiddleware.generateToken(req, res, { // Generate token and set cookie
                id: user.id,
                username: user.username,
                email: user.email
            });
            
            res.status(201).json({
                message: 'User created successfully',
                user: user.toJSON()
            });
        })
        .catch(err => {
            if (err.message === 'Username or email already exists') {
                return res.status(409).json({ error: err.message });
            }
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * POST /auth/login - user login
 * --> checks credentials --> generates token -> sets cookie -> returns user data
 */
router.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
        return res.status(400).json({ error: 'Username/email and password are required' });
    }
    
    UserDAO.getUserByCredentials(identifier, password)
        .then(user => {
            TokenMiddleware.generateToken(req, res, {
                id: user.id,
                username: user.username,
                email: user.email
            });
            
            res.json({
                message: 'Login successful',
                user: user.toJSON()
            });
        })
        .catch(err => {
            if (err.message === 'Invalid username/email or password') {
                return res.status(401).json({ error: err.message });
            }
            console.error('Error logging in:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * POST /auth/logout - user logout
 * --> removes cookie token --> returns success msg
 */
router.post('/logout', (req, res) => {
    TokenMiddleware.removeToken(req, res);
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;