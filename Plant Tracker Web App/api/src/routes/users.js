/**
 * note: 
 *      users.js was already in dozturk/milestone2_debugging branch
 *      I just moved here
 */

/**
 * what we have here:
 * 
 * GET /users/plants --> get user's plant collection
 * POST /users/plants --> add plant to collection
 * DELETE /users/plants/:plantId --> remove plant from collection
 * GET /users/profile --> get use profile
 * PUT /users/profile --> update profile
 * PUT /users/change-password --> change password
 * PUT /users/avatar --> update avatar
 * POST /api/users/custom-plants -> user adds a custom plant to their list (not to global plants table)
 */
const express = require('express');
const UserDAO = require('../db/UserDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');
const multer = require('multer');
const upload = multer({ dest: '/app/static/images/plants/' });

const router = express.Router();

// GET /api/users/plants - get user's plant collection
router.get('/plants', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    
    UserDAO.getUserPlants(userId)
        .then(plants => res.json(plants))
        .catch(err => {
            console.error('Error fetching user plants:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// POST /api/users/plants - add plant to user's collection
router.post('/plants', TokenMiddleware.TokenMiddleware, (req, res) => {
    const { plantId } = req.body;
    const userId = req.user.id;
    
    if (!plantId) {
        return res.status(400).json({ error: 'Plant ID is required' });
    }
    
    UserDAO.addPlantToUser(userId, plantId)
        .then(() => res.status(201).json({ message: 'Plant added successfully' }))
        .catch(err => {
            console.error('Error adding plant:', err);
            if (err.message === 'Plant already in your collection') {
                return res.status(409).json({ error: err.message });
            }
            res.status(500).json({ error: 'Internal server error' });
        });
});

// GET /api/users/plants/:plantId
router.get('/plants/:plantId', TokenMiddleware.TokenMiddleware, (req, res) => {
    const { plantId } = req.params;
    const userId = req.user.id;

    UserDAO.getUserPlantById(userId, plantId)
        .then(plant => {
            if (!plant) {
                return res.status(404).json({ error: 'Plant not found' });
            }
            return res.json(plant); 
        })
        .catch(err => {
            console.error('Error fetching plant:', err);
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
});


// PUT /api/users/plants/:userPlantId - update notes or photo
router.put('/plants/:userPlantId', 
    TokenMiddleware.TokenMiddleware, 
    upload.array('images', 5), 
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user found' });
        }

        const userId = req.user.id;
        const { userPlantId } = req.params;
        const { notes } = req.body;
        const imagePaths = req.files ? req.files.map(f => `/static/images/plants/${f.filename}`) : [];

        return UserDAO.updateUserPlant(userId, userPlantId, { notes, imagePaths })
            .then(() => res.json({ message: 'Success' }))
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: 'Database update failed' });
            });
    }
);


// DELETE /api/users/plants/:plantId - remove plant from user's collection
router.delete('/plants/:plantId', TokenMiddleware.TokenMiddleware, (req, res) => {
    const plantId = parseInt(req.params.plantId);
    const userId = req.user.id;
    
    UserDAO.removePlantFromUser(plantId, userId)
        .then(() => res.json({ message: 'Plant removed successfully' }))
        .catch(err => {
            console.error('Error removing plant:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// GET /api/users/profile - get current user's profile
router.get('/profile', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;

    UserDAO.getUserById(userId)
        .then(user => res.json(user.toJSON()))
        .catch(err => {
            console.error('Error fetching profile:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// PUT /api/users/profile - update current user's profile
router.put('/profile', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const { username, bio } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    UserDAO.updateUser(userId, { username, bio })
        .then(user => res.json(user.toJSON()))
        .catch(err => {
            console.error('Error updating profile:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// PUT /api/users/change-password - update current user's password
router.put('/change-password', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
    }

    // Verify current password first
    UserDAO.getUserById(userId)
        .then(user => user.validatePassword(currentPassword))
        .then(() => UserDAO.updatePassword(userId, newPassword))
        .then(() => res.json({ message: 'Password updated successfully' }))
        .catch(err => {
            const msg = (err && err.message) ? err.message : String(err);
            if (msg.toLowerCase().includes('invalid')) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
            console.error('Error changing password:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// PUT /api/users/avatar
// update user avatar
router.put('/avatar', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const { avatar } = req.body;
    
    if (!avatar) {
        return res.status(400).json({ error: 'Avatar URL is required' });
    }
    
    UserDAO.updateAvatar(userId, avatar)
        .then(user => res.json({ message: 'Avatar updated successfully', avatar: user.avatar }))
        .catch(err => {
            console.error('Error updating avatar:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// POST /api/users/custom-plants 
// add custom plant directly to user's collection (private)
// returns plant id
router.post('/custom-plants', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const { name, watering_frequency, difficulty, sunlight, size } = req.body;
    
    if (!name || !watering_frequency) {
        return res.status(400).json({ error: 'Name and watering frequency are required' });
    }
    
    UserDAO.addCustomPlantToUser(userId, { name, watering_frequency, difficulty, sunlight, size })
        .then(plantId => res.status(201).json({ message: 'Plant added to your collection', plantId: Number(plantId) }))
        .catch(err => {
            console.error('Error adding custom plant:', err);
            const errorMessage = err.message || 'Internal server error';
            if (errorMessage.includes('already in your collection') ||  // for client errors (duplicate, already exists)
                errorMessage.includes('already exists')) {
                return res.status(400).json({ error: errorMessage });
            }
            res.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = router;