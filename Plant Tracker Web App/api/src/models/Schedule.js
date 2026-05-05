class Schedule {
    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;
        this.plantId = row.plant_id;
        this.plantName = row.plant_name;
        this.task = row.task;
        this.date = row.date;
        this.completed = row.completed === 1; // converted to boolean
        this.image_url = row.image_url; // added -debug
        this.createdAt = row.created_at;
        this.updatedAt = row.updated_at;
    }
    
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            plantId: this.plantId,
            plantName: this.plantName,
            task: this.task,
            date: this.date,
            completed: this.completed, 
            image_url: this.image_url 
        };
    }
}

module.exports = Schedule;