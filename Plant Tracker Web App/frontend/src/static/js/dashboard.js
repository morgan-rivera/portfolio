import api from './APIClient.js';

// Bug 1 fix: don't grab container at top level — always look it up fresh inside functions
function getContainer() {
    return document.getElementById('plantList');
}

function loadDashboard() {
    const container = getContainer(); // Bug 1 & 4 fix: fresh lookup every time
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <p style="color:#9aaba5;">Loading your plants...</p>
        </div>
    `;

    api.getMyPlants()
        .then(plants => {
            const container = getContainer(); // re-fetch in case DOM changed
            if (!container) return;

            if (!plants || plants.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No plants yet</h3>
                        <p>Start your collection by exploring plants!</p>
                        <a href="/plants" class="btn-explore">
                            <i class="bi bi-plus-circle"></i> Explore Plants
                        </a>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';

            plants.forEach(plant => {
                const imageUrl = plant.image_url || `/static/images/plants/${plant.name.toLowerCase()}.png` || '/static/images/plants/placeholder.png';
                const diffClass = plant.difficulty === 'Beginner' ? 'beginner' :
                                  plant.difficulty === 'Intermediate' ? 'intermediate' : 'advanced';

                const card = document.createElement('div');
                card.className = 'plant-card-item';
                card.innerHTML = `
                    <button class="plant-delete-btn" onclick="event.stopPropagation(); showEditPlantModal(${plant.id})" title="Edit plant" 
                        style="position: absolute !important; top: 10px !important; left: 10px !important; right: auto !important; transform: none !important; 
                            display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; 
                            background: white !important; z-index: 1000 !important; width: 32px !important; height: 32px !important; cursor: pointer !important; pointer-events: auto !important;">
                        <i class="bi bi-pencil-square" style="color: #1e4b3f; font-size: 1.1rem; pointer-events: none;"></i>
                    </button>
                    <button class="plant-delete-btn" onclick="removePlant(${plant.id}, event)" title="Remove plant" 
                        style="position: absolute !important; top: 10px !important; right: 10px !important; left: auto !important; transform: none !important; 
                            display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; 
                            z-index: 100; width: 32px; height: 32px;">
                        <i class="bi bi-trash" style="font-size: 1.1rem; line-height: 1;"></i>
                    </button>
                    <img src="${imageUrl}"
                         class="plant-card-img"
                         alt="${plant.name}"
                         onerror="this.src='/static/images/plants/placeholder.png'">
                    <div class="plant-card-body">
                        <div class="plant-card-name">${plant.name}</div>
                        <div class="plant-card-stats">
                            <div class="plant-stat">
                                <span class="plant-stat-label">Watering</span>
                                <span class="plant-stat-value">Every ${plant.watering_frequency}d</span>
                            </div>
                            <div class="plant-stat">
                                <span class="plant-stat-label">Difficulty</span>
                                <span class="plant-stat-value ${diffClass}">${plant.difficulty}</span>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const container = getContainer();
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">⚠️</div>
                        <h3 style="color:#c62828;">Unable to load plants</h3>
                        <p>Please make sure you are logged in.</p>
                        <a href="/login" class="btn-explore" style="background:#c62828;">Go to Login</a>
                    </div>
                `;
            }
        });
}

// Bug 3 fix: attach button listener after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const addPlantBtn = document.getElementById('addPlantFromDashboardBtn');
    if (addPlantBtn) {
        addPlantBtn.addEventListener('click', showAddPlantModal);
    }
    loadDashboard();
});

window.removePlant = function(userPlantId, event) {
    event.stopPropagation();

    const confirmBox = document.createElement('div');
    confirmBox.className = 'confirm-box';
    confirmBox.innerHTML = `
        <div class="confirm-box-content">
            <div>Are you sure you want to remove this plant?</div>
            <div class="confirm-box-buttons">
                <button class="confirm-cancel" style="background: #606060;">Cancel</button>
                <button class="confirm-ok">Remove</button>
            </div>
        </div>
    `;

    document.body.appendChild(confirmBox);

    confirmBox.querySelector('.confirm-cancel').onclick = () => confirmBox.remove();
    confirmBox.querySelector('.confirm-ok').onclick = () => {
        confirmBox.remove();
        api.removeFromMyPlants(userPlantId)
            .then(() => loadDashboard())
            .catch(() => alert('Failed to remove plant. Please try again.'));
    };
};

function showAddPlantModal() {
    const existingModal = document.getElementById('addPlantModal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
        <div id="addPlantModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;">
            <div style="background: white; border-radius: 16px; width: 90%; max-width: 400px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <h3 style="color:#1e4b3f; margin-bottom: 16px;">Add Your Custom Plant</h3>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 4px;">Plant Name</label>
                    <input type="text" id="newPlantName" placeholder="e.g., Cactus" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 4px;">Watering (days)</label>
                    <input type="number" id="newPlantWatering" placeholder="e.g., 7" min="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 4px;">Difficulty</label>
                    <select id="newPlantDifficulty" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 4px;">Sunlight</label>
                    <select id="newPlantSunlight" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;">
                        <option value="Full sun">Full sun</option>
                        <option value="Partial sun">Partial sun</option>
                        <option value="Low light">Low light</option>
                    </select>
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 4px;">Size</label>
                    <select id="newPlantSize" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px;">
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 4px;">Plant Photo (optional)</label>
                    <input type="file" id="newPlantPhoto" accept="image/*" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
                    <div id="imagePreview" style="margin-top: 10px; display: none;">
                        <img id="previewImg" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                    </div>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button style="flex:1; padding: 10px; background:#606060; border:none; border-radius:8px; cursor:pointer;" onclick="window.closeAddPlantModal()">Cancel</button>
                    <button style="flex:1; padding: 10px; background:#1e4b3f; color:white; border:none; border-radius:8px; cursor:pointer;" onclick="window.saveUserPlant()">Add to My Collection</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // image preview
    document.getElementById('newPlantPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('previewImg').src = event.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

window.closeAddPlantModal = function() {
    const modal = document.getElementById('addPlantModal');
    if (modal) modal.remove();
};

window.saveUserPlant = function() {
    const name = document.getElementById('newPlantName').value.trim();
    const watering_frequency = parseInt(document.getElementById('newPlantWatering').value);
    const difficulty = document.getElementById('newPlantDifficulty').value;
    const sunlight = document.getElementById('newPlantSunlight').value;
    const size = document.getElementById('newPlantSize').value;
    const photoFile = document.getElementById('newPlantPhoto').files[0];

    if (!name || !watering_frequency) {
        alert('Please fill in plant name and watering frequency');
        return;
    }

    api.addCustomPlantToUser({ name, watering_frequency, difficulty, sunlight, size })
        .then(result => {
            if (photoFile && result.plantId) {
                // use api method instead of fetch
                return api.uploadPlantPhoto(result.plantId, photoFile, name)
                .then(() => result);
            }
            return result;
        })
        .then(() => {
            window.closeAddPlantModal();
            loadDashboard();
            alert(`"${name}" added to your collection!`);
        })
        .catch(err => {
            console.error('Error adding plant:', err);
            if (err.message && err.message.includes('already in your collection')) {
                alert(`"${name}" is already in your collection!`);
            } else if (err.message && err.message.includes('already exists')) {
                alert(`A plant named "${name}" already exists. Please use a different name.`);
            } else {
                alert('Failed to add plant. Please try again.');
            }
        });
};
window.showEditPlantModal = async function(plantId) {
    try {
        const plant = await api.getPlantDetails(plantId); 
        
        const existingModal = document.getElementById('editPlantModal');
        if (existingModal) existingModal.remove();

        const currentImagesHtml = (plant.images || []).map(url => {
            const fullUrl = url.startsWith('/') ? url : `/static/images/plants/${url}`;
            return `
                <div style="position: relative;">
                    <img src="${fullUrl}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
                </div>
            `;
        }).join('');

        const modalHtml = `
            <div id="editPlantModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 99999;">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 400px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); position: relative;">
                    <h3 style="color:#1e4b3f; margin-top: 0;">Edit ${plant.name}</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">My Notes</label>
                        <textarea id="editPlantNotes" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">${plant.notes || ''}</textarea>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">Current Photos</label>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
                            ${currentImagesHtml || '<p style="color:#999; font-size:12px;">No photos yet</p>'}
                        </div>
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">Add New Photos</label>
                        <input type="file" id="editPlantPhotos" multiple onchange="window.previewEditPhotos(event)" style="width: 100%;">
                        <div id="editImageGalleryPreview" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;"></div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button style="flex:1; padding: 12px; background:#eee; border:none; border-radius:8px; color:#606060; cursor:pointer;" onclick="document.getElementById('editPlantModal').remove()">Cancel</button>
                        <button style="flex:1; padding: 12px; background:#1e4b3f; color:white; border:none; border-radius:8px; cursor:pointer;" onclick="window.saveEdit(${plantId})">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);

    } catch (err) {
        console.error("Failed to load details:", err);
    }
};



window.previewEditPhotos = function(event) {
    const previewContainer = document.getElementById('editImageGalleryPreview');
    if (!previewContainer) return;

    previewContainer.innerHTML = ''; 
    const files = event.target.files;

    if (files) {
        Array.from(files).forEach(file => {
            const imgUrl = URL.createObjectURL(file); 
            const img = document.createElement('img');
            img.src = imgUrl;
            img.style.cssText = "width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;";
            img.onload = () => URL.revokeObjectURL(imgUrl);
            
            previewContainer.appendChild(img);
        });
    }
};

window.saveEdit = async function(plantId) {
    const formData = new FormData();
    formData.append('notes', document.getElementById('editPlantNotes').value);
    
    const photoInput = document.getElementById('editPlantPhotos');
    Array.from(photoInput.files).forEach(file => {
        formData.append('images', file);
    });

    await api.updatePlant(plantId, formData);
    document.getElementById('editPlantModal').remove();
    loadDashboard();
};