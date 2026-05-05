import api from './APIClient.js';
import { savePlants, getCachedPlants, savePendingPlant, getPendingSchedules, getPendingScheduleKeys, deletePendingSchedule } from './IndexedDBClient.js';
const plantsGrid = document.getElementById('plants-grid');
const searchInput = document.getElementById('search');
const difficultyFilter = document.getElementById('filter-difficulty');
const sunlightFilter = document.getElementById('filter-sunlight');
const sizeFilter = document.getElementById('filter-size');
const clearButton = document.getElementById('clear-filters');

const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}


// implementation: plant loading (with card) code was inside loadPlants
// moved that to displayPlants function so that we ccan call that from both the online and offline versions
function displayPlants(plants) {
    plantsGrid.innerHTML = '';
    if (plants.length === 0) {
        plantsGrid.innerHTML = '<div class="no-results">No plants found</div>';
        return;
    }
    plants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        const imageSrc = plant.image_url || plant.imageUrl || `../static/images/plants/${plant.name.toLowerCase()}.png`;
        card.innerHTML = `
            <img src="${imageSrc}"
                alt="${plant.name}" 
                class="plant-image"
                onerror="this.src='../static/images/plants/placeholder.png'">
            <div class="plant-info">
                <h3 class="plant-name">${plant.name} <i>(${plant.scientificName})</i></h3>
                <div class="plant-details">
                    <span class="plant-tag difficulty ${plant.difficulty ? plant.difficulty.toLowerCase() : 'beginner'}">${plant.difficulty || 'Beginner'}</span>
                    <span class="plant-tag">${plant.sunlight || 'Unknown'} light</span>
                    <span class="plant-tag">${plant.size || 'Unknown'}</span>
                </div>
                <p class="watering-info">
                    <small>Water every <strong>${plant.wateringFrequency}</strong> days</small>
                </p>
                <button class="add-plant-btn" onclick="addToMyPlants(${plant.id}, event)">Add to My Plants</button>
            </div>
        `;
        plantsGrid.appendChild(card);
    });
}

function loadPlants() {
    if (!plantsGrid) return;
    
    const filters = {};
    if (searchInput && searchInput.value) filters.search = searchInput.value;
    if (difficultyFilter && difficultyFilter.value) filters.difficulty = difficultyFilter.value;
    if (sunlightFilter && sunlightFilter.value) filters.sunlight = sunlightFilter.value;
    if (sizeFilter && sizeFilter.value) filters.size = sizeFilter.value;
    
    plantsGrid.innerHTML = '<div class="loading">Loading plants...</div>';
    
    api.getPlants(filters)
        .then(plants => {
            savePlants(plants);   // save fresh data to IDB
            displayPlants(plants); // display it
        })
        .catch(error => {
            console.error('Error fetching plants, trying cache...', error);
            getCachedPlants()  // IDB if offline
                .then(cachedPlants => {
                    if (cachedPlants && cachedPlants.length > 0) {
                        console.log('Loaded plants from IndexedDB cache');
                        displayPlants(cachedPlants);
                    } else {
                        plantsGrid.innerHTML = '<div class="no-results">No cached data available. Please connect to the internet.</div>';
                    }
                })
                .catch(() => {
                    plantsGrid.innerHTML = '<div class="no-results">Error loading plants</div>';
                });
        });
}

function clearFilters() {
    if (!searchInput || !difficultyFilter || !sunlightFilter || !sizeFilter) return;
    
    searchInput.value = '';
    difficultyFilter.selectedIndex = 0;
    sunlightFilter.selectedIndex = 0;
    sizeFilter.selectedIndex = 0;
    loadPlants();
}

// global function for adding plants to user collection
window.addToMyPlants = function(plantId, event) {
    console.log('Adding plant:', plantId);

    const btn = event.currentTarget;
    if (btn.disabled) return;
    
    const originalText = btn.textContent;

    if (!navigator.onLine) {
        savePendingPlant(plantId);
        btn.disabled = true;
        showNotification('Saved offline - will add when back online', 'success');
        return;
    }

    btn.disabled = true;

    api.addToMyPlants(plantId)
        .then(data => {
            console.log('Plant added to collection:', data);
            btn.disabled = true;
            showNotification('Plant added to your collection!', 'success');
        })
        .catch(error => {
            console.error('Error adding plant:', error);
            if (error.message && error.message.includes('already in your collection')) {
                showNotification('This plant is already in your collection!', 'error');
                btn.disabled = true;
            } else {
                showNotification('Failed to add plant', 'error');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
};

// sync
window.addEventListener('online', () => {
    Promise.all([getPendingSchedules(), getPendingScheduleKeys()])
        .then(([actions, keys]) => {
            if (actions.length === 0) return;

            const plantActions = actions.filter(a => a.type === 'add_plant');
            plantActions.forEach((action, index) => {
                api.addToMyPlants(action.plantId)
                    .then(() => {
                        console.log('Synced pending plant:', action.plantId);
                        deletePendingSchedule(keys[index]);

                        showNotification('Pending plants synced!', 'success');
                    })
                    .catch(err => {
                        if (err.message && err.message.includes('already in your collection')) {
                            deletePendingSchedule(keys[index]);
                        } else {
                            console.error('Failed to sync plant:', err);
                        }
                    });
            });
        })
        .catch(err => console.error('Error reading pending actions', err));
});

if (searchInput) searchInput.addEventListener('input', loadPlants);
if (difficultyFilter) difficultyFilter.addEventListener('change', loadPlants);
if (sunlightFilter) sunlightFilter.addEventListener('change', loadPlants);
if (sizeFilter) sizeFilter.addEventListener('change', loadPlants);
if (clearButton) clearButton.addEventListener('click', clearFilters);

loadPlants();