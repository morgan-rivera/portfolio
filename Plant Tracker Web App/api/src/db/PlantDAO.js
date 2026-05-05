const db = require('./DBConnection');
const Plant = require('../models/Plant'); // was missing, added

module.exports = {
    // plant database methods
    // new plants methods added (now that we don't have UserPlantDAO)
    getPlants: (filters = {}) => {
        // let sql = 'SELECT * FROM plants WHERE 1=1';
        let sql = 'SELECT id, name, scientific_name, watering_frequency, difficulty, sunlight, size, description, image_url FROM plants WHERE is_public = TRUE';
        const params = [];
        
        if (filters.difficulty) {
            sql += ' AND difficulty = ?';
            params.push(filters.difficulty);
        }
        if (filters.sunlight) {
            sql += ' AND sunlight LIKE ?';
            params.push(`%${filters.sunlight}%`);
        }
        if (filters.size) {
            sql += ' AND size = ?';
            params.push(filters.size);
        }
        if (filters.search) {
            sql += ' AND (name LIKE ? OR scientific_name LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        
        return db.query(sql, params).then(rows => {
            return rows.map(row => new Plant(row));
        });
    },

    getPlantById: (plantId) => {
        return db.query('SELECT * FROM plants WHERE id = ?', [plantId]).then(rows => {
            if (rows.length === 1) {
                return new Plant(rows[0]);
            }
            throw new Error('Plant not found');
        });
    },

    createPlant: (plantData) => {
        const { name, scientific_name, watering_frequency, difficulty, sunlight, size, description } = plantData;
        
        return db.query(
            `INSERT INTO plants (name, scientific_name, watering_frequency, difficulty, sunlight, size, description, is_public) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, scientific_name, watering_frequency, difficulty, sunlight, size, description, true]
        ).then(result => {
            if (result.affectedRows === 1) {
                return module.exports.getPlantById(result.insertId);
            }
            throw new Error('Plant could not be created');
        }).catch(err => {
            // check for duplicate entry error (mysql error code 1062)
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                throw new Error('A plant with this name already exists');
            }
            throw err;
        });
    },

    // for uploading plant pic functionality
    updatePlantImage: (plantId, imageUrl) => {
        return db.query(
            'UPDATE plants SET image_url = ? WHERE id = ?',
            [imageUrl, plantId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return true;
            }
            throw new Error('Plant image could not be updated');
        });
    },
};