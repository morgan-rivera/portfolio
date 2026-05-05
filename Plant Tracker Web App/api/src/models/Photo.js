module.exports = class Photo {
    id = null;
    userPlantId = null; // added, was missing
    url = null;
    created_at = null;

    constructor(data) {
        this.id = data.id;
        this.userPlantId = data.user_plant_id; // added, was missing
        this.url = data.url;
        this.created_at = data.created_at;
    }
    

    toJSON() {
        return {
            id: this.id,
            userPlantId: this.userPlantId, // added, was missing
            url: this.url,
            created_at: this.created_at
        }
    }
};