const db = require('./DBConnection');
const Schedule = require('../models/Schedule');

module.exports = {
    // gets all schedule entries for a user
    // JOIN with plants for image_url
    // ordered by date
    getUserSchedules: (userId) => {
        return db.query(
            `SELECT s.*, p.image_url 
            FROM schedule s 
            JOIN plants p ON s.plant_id = p.id 
            WHERE s.user_id = ? 
            ORDER BY s.date ASC`,
            [userId]
        ).then(rows => {
            return rows.map(row => new Schedule(row));
        });
    },
    
    // gets a single schedule entry by ID
    // included userId with scheduleId
    getScheduleById: (scheduleId, userId) => {
        return db.query(
            `SELECT * FROM schedule WHERE id = ? AND user_id = ?`,
            [scheduleId, userId]
        ).then(rows => {
            if (rows.length === 1) {
                return new Schedule(rows[0]);
            }
            throw new Error('Schedule entry not found');
        });
    },
    
    // Create a new schedule entry
    // sets completed = false by default
    createSchedule: (scheduleData) => {
        const { userId, plantId, plantName, task, date } = scheduleData;
        
        return db.query(
            `INSERT INTO schedule (user_id, plant_id, plant_name, task, date, completed) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, plantId, plantName, task, date, false] // sets completed = false by default
        ).then(result => {
            if (result.affectedRows === 1) {
                return module.exports.getScheduleById(result.insertId, userId);
            }
            throw new Error('Schedule entry could not be created');
        });
    },
    
    // Updatess schedule entry (toggle completed status)
    updateScheduleStatus: (scheduleId, userId, completed) => {
        return db.query(
            `UPDATE schedule SET completed = ? WHERE id = ? AND user_id = ?`,
            [completed ? 1 : 0, scheduleId, userId] // toggles completed status
        ).then(result => {
            if (result.affectedRows === 1) {
                return module.exports.getScheduleById(scheduleId, userId);
            }
            throw new Error('Schedule entry not found or not updated');
        });
    },
    
    // TODO review ---> update schedule entry (full update)
    updateSchedule: (scheduleId, userId, scheduleData) => {
        const { task, date, completed } = scheduleData;
        
        return db.query(
            `UPDATE schedule SET task = ?, date = ?, completed = ? WHERE id = ? AND user_id = ?`,
            [task, date, completed ? 1 : 0, scheduleId, userId]
        ).then(result => {
            if (result.affectedRows === 1) {
                return module.exports.getScheduleById(scheduleId, userId);
            }
            throw new Error('Schedule entry could not be updated');
        });
    },
    
    // Delete a schedule entry
    deleteSchedule: (scheduleId, userId) => { // includes userId check so that user can only access to theirs
        return db.query(
            `DELETE FROM schedule WHERE id = ? AND user_id = ?`,
            [scheduleId, userId]
        ).then(result => {
            if (result.affectedRows !== 1) {
                throw new Error('Schedule entry could not be deleted');
            }
        });
    }
};