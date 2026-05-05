const fs = require('fs');
const express = require('express');
const multer = require('multer'); // for uploading plant photo functionality
const path = require('path'); 
const PlantDAO = require('../db/PlantDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware'); // missing

const router = express.Router();

// [photo upload]
const upload = multer({ 
    dest: '/app/static/images/plants/',
    limits: { 
        fileSize: 2 * 1024 * 1024 // 2MB limit (we can increase it if we want)
    } 
});

/**
 * POST /api/plants/:plantId/photo 
 * upload photo for a plant when adding a new plant using a form (explore page)
 * [bug fixed] --> token middleware was missing
 */
router.post('/:plantId/photo', TokenMiddleware.TokenMiddleware, upload.single('photo'), (req, res) => {
    const plantId = req.params.plantId;
    const plantName = req.body.plantName;  // get plant name
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!plantName) {
        return res.status(400).json({ error: 'Plant name is required' });
    }

    // only if plant exists:
    // create filename using the given plant name (i wanted to follow similar approach to reg plant photos)
    // it was auto generating the plant pic name
    // that would work too but i think this approach it easier to debug
    PlantDAO.getPlantById(plantId)
        .then(() => {
            const plainName = plantName.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const ext = path.extname(req.file.originalname); // extension such as .png, jpg etc
            const newFilename = `${plainName}${ext}`;
            const oldPath = req.file.path;
            const newPath = path.join(req.file.destination, newFilename);
            
            // rename file
            fs.renameSync(oldPath, newPath);
            const imageUrl = `/static/images/plants/${newFilename}`;
            
            return PlantDAO.updatePlantImage(plantId, imageUrl);
        })
        .then(() => {
            res.json({ message: 'Photo uploaded successfully' });
        })
        .catch(err => {
            if (err.message === 'Plant not found') {
                return res.status(404).json({ error: 'Plant not found' });
            }
            console.error('Error:', err);
            res.status(500).json({ error: 'Failed to update plant with image' });
        });
});

/**
 * GET /api/plants
 * no auth needed -> public
 */
router.get('/', TokenMiddleware.TokenMiddleware, (req, res) => {
    const filters = {
        difficulty: req.query.difficulty,
        sunlight: req.query.sunlight,
        size: req.query.size,
        search: req.query.search
    };
    
    PlantDAO.getPlants(filters)
        .then(plants => res.json(plants))
        .catch(err => {
            console.error('Error fetching plants:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * GET /api/plants/:id
 * no auth needed --> also public 
 */
router.get('/:id', TokenMiddleware.TokenMiddleware, (req, res) => {
    PlantDAO.getPlantById(parseInt(req.params.id))
        .then(plant => res.json(plant))
        .catch(err => {
            if (err.message === 'Plant not found') {
                return res.status(404).json({ error: 'Plant not found' });
            }
            console.error('Error fetching plant:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * POST /api/plants 
 * added authentication --> only logged in users
 * [BUG FIXED]
 */
router.post('/', TokenMiddleware.TokenMiddleware, (req, res) => {
    const plantData = {
        name: req.body.name,
        scientific_name: req.body.scientific_name || req.body.scientificName,
        watering_frequency: req.body.watering_frequency || req.body.wateringFrequency,
        difficulty: req.body.difficulty,
        sunlight: req.body.sunlight,
        size: req.body.size,
        description: req.body.description
    };
    
    PlantDAO.createPlant(plantData)
        .then(newPlant => res.status(201).json(newPlant))
        .catch(err => {
            console.error('Error adding plant:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = router;