module.exports = class Task {
    id = null;
    userPlantId = null;
    name = null;
    frequency = null;
    description = null;
    isComplete = false;
    lastDone = null;  
    nextDue = null;    

    constructor(data) {
        this.id = data.id;
        this.userPlantId = data.user_plant_id;
        this.name = data.name;
        this.frequency = data.frequency;
        this.description = data.description;
        this.isComplete = data.is_complete || false;
        this.lastDone = data.last_done;  
        this.nextDue = data.next_due;   
    }
    
    markComplete() {
        this.isComplete = true;
    }

    toJSON() {
        return {
            id: this.id,
            userPlantId: this.userPlantId,
            name: this.name,
            frequency: this.frequency,
            description: this.description,
            isComplete: this.isComplete,
            lastDone: this.lastDone,
            nextDue: this.nextDue          
        }
    }
};