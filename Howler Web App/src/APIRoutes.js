const express = require('express');
const router = express.Router();
const users = require("./data/users");
const follows = require("./data/follows");
const howls = require("./data/howls");
const crypto = require('crypto');
const { generateToken, removeToken, TokenMiddleware } = require('./middleware/TokenMiddleware');

// auth routes 

/**
 * POST api/auth/register
 * Register user
 */
router.post('/auth/register', (req, res) => {
    const { username, password, first_name, last_name } = req.body;

    if (username == "" || password == "" || first_name == "" || last_name == "")
        return res.status(401).json({ error: "All fields are required" });

    if (Object.values(users).some(u => u.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    const salt = crypto.randomBytes(32).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        const newUser = {
            id: Math.max(0, ...Object.keys(users).map(Number)) + 1,
            first_name,
            last_name,
            username,
            salt,
            password: derivedKey.toString('hex'),
            avatar: `https://robohash.org/${username}.png?size=64x64&set=set1`,
        };

        users[newUser.id] = newUser;

        res.status(201).json({
            message: "User registered",
            user: {
                id: newUser.id,
                username: newUser.username,
                avatar: newUser.avatar
            }
        });
    });
});

/**
 * POST api/auth/login
 * Log in user
 */
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username == "" || password == "")
        return res.status(401).json({ error: "Email and password fields are required" });

    const user = Object.values(users).find(u => u.username === username);

    if (!user) return res.status(401).json({ error: "No such user" });

    crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        if (derivedKey.toString('hex') !== user.password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        generateToken(req, res, user);

        res.json({ 
            message: "Logged in",
            user: { 
                id: user.id, 
                username: user.username, 
                avatar: user.avatar 
            } 
        });
    });
});

/**
 * POST api/auth/logout
 * Log out user
 */
router.post('/auth/logout', TokenMiddleware, (req, res) => {
    removeToken(req, res);
    res.json({ message: "Logged out" });
});



// howl routes

/**
 * POST api/howl
 * Post howl
 */
router.post('/howl', TokenMiddleware, (req, res) => {
    const howl = {
        id: howls.length + 1,
        userId: Number(req.user.id),
        text: req.body.text,
        datetime: new Date()
    };

    howls.push(howl);

    res.json(howl);
});

/**
 * GET api/howl/following
 * Get howls of all users you follow
 */
router.get('/howl/following', TokenMiddleware, (req, res) => {
    const currentUserId = Number(req.user.id);
    const followData = follows[currentUserId];
    const followingIds = followData ? followData.following.map(Number) : [];

    const feed = howls.filter(howl => {
        const authorId = Number(howl.userId);
        return authorId === currentUserId || followingIds.includes(authorId);
    });
    feed.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    const feedWithUsernames = feed.map(howl => {
        const user = users[howl.userId];
        return { 
            ...howl, 
            username: user ? user.username : `User${howl.userId}` 
        };
    });
    res.json(feedWithUsernames);
});

/**
 * GET api/howl/:username
 * Get howls of given user
 */
router.get('/howl/:username', TokenMiddleware, (req, res) => {
    const targetUsername = req.params.username; 
    const user = Object.values(users).find(u => u.username === targetUsername);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const userHowls = howls.filter(howl => Number(howl.userId) === Number(user.id));
    userHowls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    res.json(userHowls);
});




// user routes


/**
 * GET api/user/current
 * Get current user
 */
router.get('/user/current', TokenMiddleware, (req, res) => {
    const user = Object.values(users).find(u => u.id === req.user.id);
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
});

/**
 * GET api/users
 * Get all users
 */
router.get('/users', TokenMiddleware, (req, res) => {
    const usersArray = Object.values(users);
    res.json(usersArray);
});

/**
 * GET api/user/following
 * Get all users you follow
 */
router.get('/user/following', TokenMiddleware, (req, res) => {    
    const currentUserId = req.user.id;
    const followData = follows[currentUserId];
    const followingList = followData ? followData.following : [];

    res.json(followingList);
});
/**
 * GET api/user/:username/following
 * Get given user's following list
 */
router.get('/user/:username/following', TokenMiddleware, (req, res) => {
    const targetUsername = req.params.username;
    const user = Object.values(users).find(u => u.username === targetUsername);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const followData = follows[Number(user.id)];
    const followingIds = followData ? followData.following : [];

    res.json(followingIds);
});


/**
 * GET api/user/username
 * Get user of given username
 */
router.get('/user/:username', TokenMiddleware, (req, res) => {
    const user = Object.values(users).find(u => u.username === req.params.username);

    if (!user)
        return res.status(404).json({ error: "User not found" });

    res.json(user);

});


/**
 * POST api/user/follow/:userId
 * Follow given user
 */
router.post('/user/follow/:userId', TokenMiddleware, (req, res) => {
    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.userId);

    if (!follows[currentUserId]) {
        follows[currentUserId] = { userId: currentUserId, following: [] };
    }
    
    if (!follows[currentUserId].following.includes(targetUserId)) {
        follows[currentUserId].following.push(targetUserId);
    }
    res.json({ message: "Following" });
    
});

/**
 * POST api/user/unfollow/:userId
 * Unfollow given user
 */
router.post('/user/unfollow/:userId', TokenMiddleware, (req, res) => {
    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.userId);
    if (follows[currentUserId])
        follows[currentUserId].following = follows[currentUserId].following.filter(id => id !== targetUserId);
    
    res.json({ message: "Unfollowed" });
});


module.exports = router;
