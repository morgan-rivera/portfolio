// moved from dozturk/milestone2_ddebugging
// plant model added @april 10, deniz
class Plant {
    id = null;
    name = null;
    scientificName = null;
    wateringFrequency = null;
    difficulty = null;
    sunlight = null;
    size = null;
    description = null;
    imageUrl = null;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.scientificName = data.scientific_name;
        this.wateringFrequency = data.watering_frequency;
        this.difficulty = data.difficulty;
        this.sunlight = data.sunlight;
        this.size = data.size;
        this.description = data.description;
        this.imageUrl = data.image_url;
    }

    // helper method to check if plant is beginner friendly
    isBeginnerFriendly() {
        return this.difficulty === 'Beginner';
    }

    // helper method to get watering schedule text
    getWateringSchedule() {
        return `Water every ${this.wateringFrequency} days`;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            scientificName: this.scientificName,
            wateringFrequency: this.wateringFrequency,
            difficulty: this.difficulty,
            sunlight: this.sunlight,
            size: this.size,
            description: this.description,
            imageUrl: this.imageUrl,
            isBeginnerFriendly: this.isBeginnerFriendly(),
            wateringSchedule: this.getWateringSchedule()
        };
    }
}

module.exports = Plant;