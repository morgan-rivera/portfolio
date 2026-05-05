import api from './APIClient.js';

const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}


function loadProfile() {
    api.getProfile()
        .then(user => {
            const nameEl = document.getElementById('profileName');
            const avatarDiv = document.getElementById('avatarDiv');
            if (nameEl) nameEl.textContent = user.username || 'Plant Lover';
            const bioEl = document.getElementById('profileBio');
            if (bioEl) bioEl.textContent = user.bio || 'No bio yet';
            if (avatarDiv) {
                if (user.avatar) {
                    avatarDiv.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                } else {
                    avatarDiv.textContent = (user.username || 'U').charAt(0).toUpperCase();
                }
            }
        })
        .catch(err => console.error('Error fetching profile:', err));

    api.getMyPlants()
        .then(plants => {
            const el = document.getElementById('statPlants');
            if (el) el.textContent = plants.length;
        }).catch(() => {});

    api.getSchedule()
        .then(tasks => {
            const el = document.getElementById('statTasks');
            if (el) el.textContent = tasks.filter(t => t.completed).length;
        }).catch(() => {});
}

function showAvatarSelection() {
    const existing = document.getElementById('avatarModal');
    if (existing) existing.remove();

    let grid = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;max-height:400px;overflow-y:auto;padding:10px;">';
    for (let i = 1; i <= 50; i++) {
        const num = i.toString().padStart(2, '0');
        const img = `/static/images/avatars/Avatars Set Flat Style-${num}.png`;
        grid += `<div style="cursor:pointer;text-align:center;" onclick="window.selectAvatar('${img}')">
                    <img src="${img}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">
                 </div>`;
    }
    grid += '</div>';

    document.body.insertAdjacentHTML('beforeend', `
        <div id="avatarModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2000;">
            <div style="background:white;border-radius:16px;width:90%;max-width:500px;padding:24px;">
                <h3 style="color:#1e4b3f;margin-bottom:12px;">Choose Your Avatar</h3>
                ${grid}
                <button style="width:100%;margin-top:16px;padding:10px;background:#eee;border:none;border-radius:8px;cursor:pointer;" onclick="window.closeAvatarModal()">Cancel</button>
            </div>
        </div>`);
}

window.closeAvatarModal = function() {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.remove();
};

window.selectAvatar = function(avatarUrl) {
    api.updateAvatar(avatarUrl)
        .then(() => { window.closeAvatarModal(); loadProfile(); })
        .catch(() => showNotification('Failed to update avatar', 'error'));
};

function showEditProfileModal() {
    const currentName = document.getElementById('profileName').textContent;
    const currentBio = document.getElementById('profileBio').textContent;
    const existing = document.getElementById('editProfileModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', `
        <div id="editProfileModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2000;">
            <div style="background:white;border-radius:16px;width:90%;max-width:400px;padding:24px;">
                <h3 style="color:#1e4b3f;margin-bottom:16px;">Edit Profile</h3>
                <div style="margin-bottom:12px;">
                    <label style="display:block;margin-bottom:4px;font-weight:600;">Username</label>
                    <input type="text" id="editUsername" value="${currentName}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="display:block;margin-bottom:4px;font-weight:600;">Bio</label>
                    <textarea id="editBio" rows="3" placeholder="Tell us about yourself..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;resize:vertical;">${currentBio === 'No bio yet' ? '' : currentBio}</textarea>
                </div>
                <div style="display:flex;gap:8px;margin-top:16px;">
                    <button style="flex:1;padding:10px;background:#606060;border:none;border-radius:8px;cursor:pointer;" onclick="window.closeEditProfileModal()">Cancel</button>
                    <button style="flex:1;padding:10px;background:#1e4b3f;color:white;border:none;border-radius:8px;cursor:pointer;" onclick="window.saveProfileChanges()">Save</button>
                </div>
            </div>
        </div>`);
}

window.closeEditProfileModal = function() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.remove();
};

window.saveProfileChanges = function() {
    const username = document.getElementById('editUsername').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    if (!username) { 
        showNotification('Username is required', 'error');
        return; 
    }
    api.updateProfile(username, bio)
        .then(() => { window.closeEditProfileModal(); loadProfile(); })
        .catch(() => showNotification('Failed to update profile', 'error'));
};

function showChangePasswordModal() {
    const existing = document.getElementById('changePasswordModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', `
        <div id="changePasswordModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2000;">
            <div style="background:white;border-radius:16px;width:90%;max-width:400px;padding:24px;">
                <h3 style="color:#1e4b3f;margin-bottom:16px;">Change Password</h3>
                <div style="margin-bottom:12px;">
                    <label style="display:block;margin-bottom:4px;">Current Password</label>
                    <input type="password" id="currentPassword" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="display:block;margin-bottom:4px;">New Password</label>
                    <input type="password" id="newPassword" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="display:block;margin-bottom:4px;">Confirm New Password</label>
                    <input type="password" id="confirmPassword" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;">
                </div>
                <div style="display:flex;gap:8px;margin-top:16px;">
                    <button style="flex:1;padding:10px;background:#606060;border:none;border-radius:8px;cursor:pointer;" onclick="window.closeChangePasswordModal()">Cancel</button>
                    <button style="flex:1;padding:10px;background:#1e4b3f;color:white;border:none;border-radius:8px;cursor:pointer;" onclick="window.savePasswordChanges()">Update</button>
                </div>
            </div>
        </div>`);
}

window.closeChangePasswordModal = function() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.remove();
};

window.savePasswordChanges = function() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword) { 
        showNotification('Please fill in all fields', 'error');
        return; 
    }
    if (newPassword !== confirmPassword) { 
        showNotification('New passwords do not match', 'error');
        return; 
    }

    api.changePassword(currentPassword, newPassword)
        .then(() => { 
            window.closeChangePasswordModal(); 
            showNotification('Password changed!', 'success'); 
        })
        .catch(() => showNotification('Failed. Check your current password.', 'error'));
};

window.handleLogout = function() {
    api.logout().finally(() => window.location.href = '/login');
};

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();

    const avatarDiv = document.getElementById('avatarDiv');
    if (avatarDiv) avatarDiv.addEventListener('click', showAvatarSelection);

    const editBtn = document.querySelector('.edit-profile-btn');
    if (editBtn) editBtn.addEventListener('click', showEditProfileModal);

    const changePassItem = document.getElementById('changePasswordItem');
    if (changePassItem) changePassItem.addEventListener('click', showChangePasswordModal);
});