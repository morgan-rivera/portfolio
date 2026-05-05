const db = require('./DBConnection');
const User = require('../models/User');
const crypto = require('crypto');

/**
 * summary/overview of this UserDAO:
 * 
 * 1. getUserByCredentials(identifier, password) -> for login
 * 2. getUserById(userId) 
 * 3. createUser(userData:username, email, password) -> register
 * 4. getUserPlants(userId) -> get user's plant collection
 * 5. addPlantToUser(userId, plantId) --> add plant to collection. also added duplicate prevention, working now
 * 6. removePlantFromUser(userPlantId, userId)
 * 7. updateWateringStatus: (userPlantId, lastWatered, nextWatering) --> TODO -> may have tasks
 * 8. updatePlantNotes: (userPlantId, notes) --> TODO - review
 * 9. updateUser: (userId, userData) --> TODO - review
 * 10. updateAvatar: (userId, avatarUrl) --> TODO - [bonus feature] make sure working properly. last time it wasn't working 
 */

module.exports = {
    // for login
    getUserByCredentials: (identifier, password) => {
        return db.query('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier])
            .then(rows => {
                if (rows.length === 1) {
                    const user = new User(rows[0]);
                    return user.validatePassword(password);
                }
                throw new Error("Invalid username/email or password");
            });
    },

    getUserById: (userId) => {
        return db.query('SELECT * FROM users WHERE id = ?', [userId])
            .then(rows => {
                if (rows.length === 1) {
                    return new User(rows[0]); // review this. returns without loading plants
                }
                throw new Error("User not found");
            });
    },

    getUserByUsername: (username) => {
        return db.query('SELECT * FROM users WHERE username = ?', [username])
            .then(rows => {
                if (rows.length === 1) {
                    return new User(rows[0]);
                }
                return null;
            });
    },

    createUser: (userData) => {
        const { username, email, password } = userData;
        
        // first check if user already exists
        return db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email])
            .then(existingUsers => {
                if (existingUsers.length > 0) {
                    throw new Error("Username or email already exists");
                }
                
                const salt = crypto.randomBytes(16).toString('hex');
                
                // hashing password
                return new Promise((resolve, reject) => {
                    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                        if (err) {
                            reject("Error creating password hash: " + err);
                        }
                        const passwordHash = derivedKey.toString('hex');
                        resolve({ salt, passwordHash });
                    });
                });
            })
            .then(({ salt, passwordHash }) => {
                // inserting new user
                return db.query(
                    'INSERT INTO users (username, email, salt, password_hash) VALUES (?, ?, ?, ?)',
                    [username, email, salt, passwordHash]
                );
            })
            .then(result => {
                if (result.affectedRows === 1) {
                    return module.exports.getUserById(result.insertId);
                }
                throw new Error("User could not be created");
            });
    },

    // get user's plant collection with JOIN -- CHECK
    getUserPlants: (userId) => {
        return db.query(
           `SELECT user_plants.*, plants.name, plants.watering_frequency, plants.difficulty, plants.sunlight, plants.size , plants.image_url, plants.is_public
            FROM user_plants 
            JOIN plants ON user_plants.plant_id = plants.id 
            WHERE user_plants.user_id = ?`,
            [userId]
        );
    },

    // updated - debugging. it was adding the same plant multiple times
    // it wasn't preventing duplicates
    addPlantToUser: (userId, plantId) => {
        return db.query(
            'INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)',
            [userId, plantId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return result.insertId;
            }
            throw new Error("Plant could not be added");
        }).catch(err => {
            // if it's a duplicate entry error (MySQL error code 1062)
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                throw new Error('Plant already in your collection');
            }
            console.error('SQL Error:', err);
            throw new Error('Database error: ' + err.message);
            // throw err;
        });
    },

    getUserPlantById: (userId, plantId) => {
        return db.query(`
            SELECT 
                up.id, up.notes,  p.name, 
                GROUP_CONCAT(ph.url) as photo_urls
            FROM user_plants up
            JOIN plants p ON up.plant_id = p.id
            LEFT JOIN photos ph ON up.id = ph.user_plant_id
            WHERE up.user_id = ? AND up.id = ?
            GROUP BY up.id`, 
            [userId, plantId]
        ).then(rows => {
            const plant = Array.isArray(rows) ? rows[0] : rows;
            if (!plant) 
                throw new Error("Plant not found");

            plant.images = plant.photo_urls ? plant.photo_urls.split(',') : [];
            
            return plant;
        });
    },

    updateUserPlant: (userId, userPlantId, { notes, imagePaths }) => {
        return db.query('UPDATE user_plants SET notes = ? WHERE id = ? AND user_id = ?', 
            [notes, userPlantId, userId]
        ).then(() => {
            if (imagePaths && imagePaths.length > 0) {
                const promises = imagePaths.map(url => {
                    return db.query('INSERT INTO photos (user_plant_id, url) VALUES (?, ?)', 
                        [userPlantId, url]);
                });
                return Promise.all(promises);
            }
        });
    },


    // before (old-will remove later but keep it for now for reference)
    // addPlantToUser: (userId, plantId, name = null) => {
    //     return db.query(
    //         'INSERT INTO user_plants (user_id, plant_id, nname) VALUES (?, ?, ?)',
    //         [userId, plantId, name]
    //     ).then(result => {
    //         if (result.affectedRows === 1) {
    //             return result.insertId;
    //         }
    //         throw new Error("Plant could not be added to user collection");
    //     });
    // },

    removePlantFromUser: (userPlantId, userId) => {
        return db.query('SELECT plant_id FROM user_plants WHERE id = ? AND user_id = ?', [userPlantId, userId]) // bug fixing: get the plant_id before deleting to remove from multiple tables
        .then(rows => {
            if (rows.length === 0) {
                throw new Error("Plant not found in user collection");
            }
            const plantId = rows[0].plant_id;
            // first delete from user_plants 
            return db.query('DELETE FROM user_plants WHERE id = ? AND user_id = ?', [userPlantId, userId]) 
                .then(result => {
                    if (result.affectedRows !== 1) {
                        throw new Error("Plant could not be removed from user collection");
                    }
                    // then also delete fromschedule entries 
                    return db.query('DELETE FROM schedule WHERE user_id = ? AND plant_id = ?', [userId, plantId]);
                });
        });
    },

    updateWateringStatus: (userPlantId, lastWatered, nextWatering) => {
        return db.query(
            'UPDATE user_plants SET last_watered = ?, next_watering = ? WHERE id = ?',
            [lastWatered, nextWatering, userPlantId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return true;
            }
            throw new Error("Watering status could not be updated");
        });
    },

    updatePlantNotes: (userPlantId, notes) => {
        return db.query(
            'UPDATE user_plants SET notes = ? WHERE id = ?',
            [notes, userPlantId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return true;
            }
            throw new Error("Plant notes could not be updated");
        });
    },

    // updated for profile methods
    updateUser: (userId, userData) => {
        const { username, bio } = userData;
        
        return db.query(
            'UPDATE users SET username = ?, bio = ? WHERE id = ?',
            [username, bio || null, userId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return module.exports.getUserById(userId);
            }
            throw new Error("User could not be updated");
        });
    },

    // Update user password
    updatePassword: (userId, newPassword) => {
        const salt = crypto.randomBytes(16).toString('hex');
        
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(newPassword, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject("Error creating password hash: " + err);
                }
                const passwordHash = derivedKey.toString('hex');
                
                db.query(
                    'UPDATE users SET salt = ?, password_hash = ? WHERE id = ?',
                    [salt, passwordHash, userId]
                ).then(result => {
                    if (result.affectedRows === 1) {
                        resolve();
                    }
                    reject(new Error("Password could not be updated"));
                }).catch(reject);
            });
        });
    },

    updateAvatar: (userId, avatarUrl) => {
        return db.query(
            'UPDATE users SET avatar = ? WHERE id = ?',
            [avatarUrl, userId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return module.exports.getUserById(userId);
            }
            throw new Error("Avatar could not be updated");
        });
    },

    // adds custom plant directly to user collection
    // (creates private plant in global plants table first)
    addCustomPlantToUser: (userId, plantData) => {
        const { name, watering_frequency, difficulty, sunlight, size } = plantData;
        const normalizedName = name.trim();
        // first checking if user already has a plant with this name
        return db.query(
            `SELECT p.name 
            FROM user_plants up 
            JOIN plants p ON up.plant_id = p.id 
            WHERE up.user_id = ? AND LOWER(p.name) = LOWER(?)`,
            [userId, normalizedName]
        ).then(existing => {
            if (existing.length > 0) {
                throw new Error('This plant is already in your collection');
            }
            
            return db.query(
                `INSERT INTO plants (name, watering_frequency, difficulty, sunlight, size, is_public) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [normalizedName, watering_frequency, difficulty, sunlight, size, false]
            );
        }).then(result => {
            const plantId = Number(result.insertId);
            return db.query(
                'INSERT INTO user_plants (user_id, plant_id) VALUES (?, ?)',
                [userId, plantId]
            ).then(() => plantId);
        }).catch(err => {
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                throw new Error('A plant with this name already exists in the database');
            }
            throw err;
        });
    },


};