import api from './APIClient.js';
import { savePendingSchedule, getPendingSchedules, getPendingScheduleKeys, deletePendingSchedule } from './IndexedDBClient.js';

const scheduleList = document.getElementById('schedule-list');

// for formatting date function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function loadSchedule() {
    scheduleList.innerHTML = '<p class="loading">Loading schedule...</p>';

    api.getSchedule()
        .then(schedules => {
            scheduleList.innerHTML = '';

            if (schedules.length === 0) {
                scheduleList.innerHTML = '<p class="empty-msg">No scheduled tasks yet.</p>';
                return;
            }

            schedules.forEach(entry => {
                const card = document.createElement('div');
                card.className = 'schedule-card';

                const statusClass = entry.completed ? 'green' : 'red';
                const statusText = entry.completed ? 'Completed' : 'Pending';
                const buttonText = entry.completed ? 'Undo' : 'Mark Completed';
                const imageUrl = entry.image_url || `/static/images/plants/${entry.plantName.toLowerCase()}.png`;

                card.innerHTML = `
                    <img src="${imageUrl}" 
                         alt="${entry.plantName}" 
                         style="width: 70px; height: 70px; object-fit: cover; border-radius: 12px;"
                         onerror="this.src='/static/images/plants/placeholder.png'">
                    <div class="card-info">
                        <a href="/plants/${entry.plantId}" class="plant-name" data-link>${entry.plantName}</a>
                        <p class="last-action">
                            <strong>Task:</strong> ${entry.task}
                        </p>
                        <p class="next-task">
                            <strong>Date:</strong> ${formatDate(entry.date)}
                        </p>
                        <p class="status">
                            <strong>Status:</strong> <span class="date-highlight ${statusClass}">${statusText}</span>
                        </p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-log" onclick="window.toggleComplete(${entry.id}, ${!entry.completed})">
                            ${buttonText}
                        </button>
                        <button class="btn-delete" onclick="window.deleteEntry(${entry.id})">Delete</button>
                    </div>
                `;

                scheduleList.appendChild(card);
            });
        })
        .catch(err => {
            scheduleList.innerHTML = '<p class="error-msg">Failed to load schedule.</p>';
            console.error('Error fetching schedule:', err);
        });
}

// global function 1 --> for completed/not completed
window.toggleComplete = function(entryId, completed) {
    api.updateScheduleStatus(entryId, completed)
        .then(() => loadSchedule())
        .catch(err => console.error('Error updating entry:', err));
};
// global function 2 --> deleting schedule entry
window.deleteEntry = function(entryId) {
    if (!confirm('Remove this schedule entry?')) return;

    api.deleteSchedule(entryId)
        .then(() => loadSchedule())
        .catch(err => console.error('Error deleting entry:', err));
};

// global function 3 --> for adding schedule entry
window.addScheduleEntry = function() {
    // getting user's plants to populate dropdown
    api.getMyPlants()
        .then(plants => {
            if (!plants || plants.length === 0) {
                showNotification('You need to add plants to your collection first!', 'error');
                return;
            }
            
            const modalHtml = `
                <div id="addScheduleModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                    <div style="background: white; border-radius: 16px; width: 90%; max-width: 400px; padding: 24px;">
                        <h3 class="text-success mb-4">Add Schedule Task</h3>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Select Plant</label>
                            <select id="schedulePlantId" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;">
                                <option value="">Choose a plant...</option>
                                ${plants.map(plant => `<option value="${plant.plant_id || plant.id}">${plant.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Task</label>
                            <input type="text" id="scheduleTask" placeholder="e.g., Water, Fertilize, Prune" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Date</label>
                            <input type="date" id="scheduleDate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;">
                        </div>
                        <div class="d-flex gap-2 mt-4">
                            <button class="btn btn-secondary" style="flex:1; padding: 10px;" onclick="closeScheduleModal()">Cancel</button>
                            <button class="btn btn-success" style="flex:1; padding: 10px;" onclick="saveScheduleEntry()">Add Task</button>
                        </div>
                    </div>
                </div>
            `;
            
            // removed --> existing modal if any
            const existingModal = document.getElementById('addScheduleModal');
            if (existingModal) existingModal.remove();
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Set default date to today
            document.getElementById('scheduleDate').value = new Date().toISOString().split('T')[0];
        })
        .catch(err => {
            console.error('Error fetching plants:', err);
            showNotification('Failed to load your plants. Please try again.', 'error');
        });
};

// Helper function to close modal
window.closeScheduleModal = function() {
    const modal = document.getElementById('addScheduleModal');
    if (modal) modal.remove();
};

window.saveScheduleEntry = function() {
    const plantSelect = document.getElementById('schedulePlantId');
    const plantId = plantSelect.value;
    const plantName = plantSelect.options[plantSelect.selectedIndex]?.text;
    const task = document.getElementById('scheduleTask').value;
    const date = document.getElementById('scheduleDate').value;

    if (!plantId || !task || !date) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const scheduleData = {
        plantId: parseInt(plantId),
        plantName: plantName,
        task: task,
        date: date
    };

    api.createSchedule(scheduleData)
        .then(() => {
            closeScheduleModal();
            loadSchedule();
            showNotification('Task added successfully!', 'success');
        })
        .catch(err => {
            // TypeError ===> network failure (offline or unreachable)
            // SyntaxError => service worker returned offline HTML instead of JSON
            // if offline, save to IDB instead
            if (err instanceof TypeError || err instanceof SyntaxError) {
                console.log('Offline - saving schedule to IndexedDB');
                savePendingSchedule(scheduleData);
                closeScheduleModal();
                showNotification('You are offline. Task will be synced when you reconnect.', 'success');
            } else {
                console.error('Error creating schedule:', err);
                showNotification('Failed to add task. Please try again.', 'error');
            }
        });
};

// OFFLINE SYNC 
// when user comes back online, sync any pending schedules to the server
window.addEventListener('online', () => {
    // get all pending entries and their keys
    Promise.all([getPendingSchedules(), getPendingScheduleKeys()])
        .then(([schedules, keys]) => {
            if (schedules.length === 0) {
                return;
            }

            // send each pending entry to the server
            schedules.forEach((scheduleData, index) => {
                api.createSchedule(scheduleData)
                    .then(() => {
                        console.log('Synced pending schedule:', scheduleData);
                        deletePendingSchedule(keys[index]); // remove from IDB after sync
                        loadSchedule(); // refresh the list
                    })
                    .catch(err => {
                        console.error('Failed to sync pending schedule:', err);
                    });
            });
        })
        .catch(err => {
            console.error('Error reading pending schedules', err);
        });
});

// to send push notf. when coming back online
window.addEventListener('online', () => {
  if (Notification.permission === 'granted') {
    const userId = localStorage.getItem('userId');
    if (userId) {
      subscribeToPush(userId);
    }
  }
});

loadSchedule();