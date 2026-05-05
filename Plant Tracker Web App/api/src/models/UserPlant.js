const Task = require('./Task');
const Photo = require('./Photo');

module.exports = class UserPlant {
    id = null;
    userId = null; // was missing
    plantId = null; // was missing
    name = null; // -> comes from plants.name (from JOIN)
    // location = null; // -> not needed
    notes = null;
    tasks = [];
    photos = [];
    image_url = null; // from plants.image_url

    // plant details from JOIN
    scientific_name = null;
    watering_frequency = null;
    difficulty = null;
    sunlight = null;
    size = null;
    description = null;
    is_public = null;

    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id; // was missing
        this.plantId = data.plant_id; // was missing
        this.name = data.name; // gets plant details from JOIN

        // this.location = data.location;
        this.notes = data.notes;
        this.tasks = (data.tasks || []).map(t => new Task(t)); // fixed typo (new Task), it was new Tasks
        this.photos = (data.photos || []).map(p => new Photo(p));
        this.image_url = data.image_url;

        this.watering_frequency = data.watering_frequency;
        this.difficulty = data.difficulty;
        this.sunlight = data.sunlight;
        this.size = data.size;
        this.description = data.description;
        this.is_public = data.is_public;
    }

    // task helper
    addTask(taskData) {
        const task = new Task(taskData);
        this.tasks.push(task);
        return task;
    }

    // helper
    deleteTask(taskId) {
        const originalLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        return this.tasks.length !== originalLength; // true if task removed, false if nothing changed
    
    }

    getTask(taskId) {
        return this.tasks.find(t => t.id === taskId);
    }

    // photo helper
    addPhoto(photoData) {
        const photo = new Photo(photoData);
        this.photos.push(photo);
        return photo;
    }

    deletePhoto(photoId) {
        const originalLength = this.photos.length;
        this.photos = this.photos.filter(p => p.id !== photoId);
        return this.photos.length !== originalLength;
    }

    getPhotoById(photoId) {
        return this.photos.find(p => p.id === photoId);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId, //added
            plantId: this.plantId, // added
            name: this.name,
            // location: this.location,
            notes: this.notes,
            image_url: this.image_url, // added
            tasks: this.tasks.map(t => t.toJSON()),
            photos: this.photos.map(p => p.toJSON()),
            scientific_name: this.scientific_name,
            watering_frequency: this.watering_frequency,
            difficulty: this.difficulty,
            sunlight: this.sunlight,
            size: this.size,
            image_url: this.image_url,  // now will be in api responses
            description: this.description,
            is_public: this.is_public,

        }
    }
};