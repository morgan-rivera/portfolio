const { sendPush } = require('./PushRoutes');
const express = require('express');
const ScheduleDAO = require('../db/ScheduleDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');

const router = express.Router();
/**
 * notes to team:
 * 
 * - used TokenMiddleware on all routes
 * - 404 - for not found
 * - 201 - for create
 * - 500 - server errorr
 * -- used req.user.id from token
 */

/**
 * end points summary:
 * 
 * GET /api/schedule  -> get all user's schedule entries
 * GET /api/schedule/:id  -> get specific schedule entry
 * POST /api/schedule -> create schedule entry
 * PUT /api/schedule/:id -> update completion status
 * DELETE /api/schedule/:id -> delete schedule entry
 * 
 */

/**
 * GET /api/schedule 
 * get all schedule entries
 */
router.get('/', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    
    ScheduleDAO.getUserSchedules(userId)
        .then(schedules => res.json(schedules))
        .catch(err => {
            console.error('Error fetching schedules:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * GET /api/schedule/:id 
 * get a specific schedule entry
 */
router.get('/:id', TokenMiddleware.TokenMiddleware, (req, res) => {
    const scheduleId = parseInt(req.params.id);
    const userId = req.user.id;
    
    ScheduleDAO.getScheduleById(scheduleId, userId)
        .then(schedule => res.json(schedule))
        .catch(err => {
            if (err.message === 'Schedule entry not found') {
                return res.status(404).json({ error: 'Schedule entry not found' });
            }
            console.error('Error fetching schedule:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * POST /api/schedule
 *  create a new schedule entry
 */
router.post('/', TokenMiddleware.TokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const { plantId, plantName, task, date } = req.body;
    
    if (!plantId || !plantName || !task || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    ScheduleDAO.createSchedule({ userId, plantId, plantName, task, date })
        .then(newSchedule => {
            // send a push notification if the task is due today
            const taskDateStr = new Date(date).toISOString().split('T')[0];
            const todayStr = new Date().toISOString().split('T')[0];
 
            if (taskDateStr === todayStr) {
                sendPush(userId, plantName, task); // send push notification to the user (if they enable that functionality)
            }
            res.status(201).json(newSchedule);
        })
        .catch(err => {
            console.error('Error creating schedule:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * PUT /api/schedule/:id 
 * update a schedule entry
 */
router.put('/:id', TokenMiddleware.TokenMiddleware, (req, res) => {
    const scheduleId = parseInt(req.params.id);
    const userId = req.user.id;
    const { completed } = req.body;
    
    if (completed === undefined) {
        return res.status(400).json({ error: 'Completed status is required' });
    }
    
    ScheduleDAO.updateScheduleStatus(scheduleId, userId, completed)
        .then(updatedSchedule => res.json(updatedSchedule))
        .catch(err => {
            if (err.message === 'Schedule entry not found or not updated') {
                return res.status(404).json({ error: 'Schedule entry not found' });
            }
            console.error('Error updating schedule:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

/**
 * DELETE /api/schedule/:id 
 * delete a schedule entry
 */
router.delete('/:id', TokenMiddleware.TokenMiddleware, (req, res) => {
    const scheduleId = parseInt(req.params.id);
    const userId = req.user.id;
    
    ScheduleDAO.deleteSchedule(scheduleId, userId)
        .then(() => res.json({ message: 'Schedule entry deleted successfully' }))
        .catch(err => {
            if (err.message === 'Schedule entry could not be deleted') {
                return res.status(404).json({ error: 'Schedule entry not found' });
            }
            console.error('Error deleting schedule:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = router;