// done @april 6 - deniz
const crypto = require('crypto');
const UserPlant = require('./UserPlant');

// note: followed similar approach to class exercises day 21
module.exports = class User {
    id = null;
    username = null;
    email = null;
    avatar = null;
    bio = null; 
    #passwordHash = null;
    #salt = null;
    plants = [];
    created_at = null;
    updated_at = null;

    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.avatar = data.avatar;
        this.bio = data.bio || null;
        this.#salt = data.salt;
        this.#passwordHash = data.password_hash;
        this.plants = (data.plants || []).map(p => new UserPlant(p));
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    validatePassword(password) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject("Error: " + err);
                }

                const digest = derivedKey.toString('hex');
                if (this.#passwordHash === digest) {
                    resolve(this);
                } else {
                    reject("Invalid username or password");
                }
            });
        });
    }

    addPlant(plantData) {
        const plant = new UserPlant(plantData);

        const exists = this.plants.some(p => p.id === plant.id);
        if (!exists) {
            this.plants.push(plant);
        }

        return plant;
    }

    deletePlant(plantId) {
        const originalLength = this.plants.length;
        this.plants = this.plants.filter(p => p.id !== plantId);
        return this.plants.length !== originalLength; // true if plant removed, false if nothing changed
    }

    getPlantById(id) {
        return this.plants.find(p => p.id === id);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            avatar: this.avatar,
            bio: this.bio,
            plants: this.plants,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
};