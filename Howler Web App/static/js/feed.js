const fetchOptions = { credentials: "include" };


// Get user list
async function loadUsers() {
    const userListElement = document.querySelector('#user-list');
    const fetchOptions = { credentials: "include" };

    try {
        const meRes = await fetch('/api/user/current', fetchOptions);
        const me = await meRes.json();

        const usersRes = await fetch('/api/users', fetchOptions);
        if (!usersRes.ok) throw new Error("Could not load user list.");
        const allUsers = await usersRes.json();

        const followsRes = await fetch('/api/user/following', fetchOptions);
        let myFollowingIds = [];
        if (followsRes.ok) {
            const followsData = await followsRes.json();
            myFollowingIds = Array.isArray(followsData) ? followsData.map(Number) : [];
        }
        renderUserList(allUsers, me, myFollowingIds);

    } catch (error) {
        console.error("Initialization failed:", error.message);
        if (userListElement) userListElement.innerHTML = `<li>${error.message}</li>`;
    }
}

// Format user list
function renderUserList(allUsers, me, myFollowingIds) {
    const userListElement = document.querySelector('#user-list');
    if (!userListElement) return;

    userListElement.innerHTML = ''; 
    const userArray = Array.isArray(allUsers) ? allUsers : Object.values(allUsers);

    userArray.forEach(user => {
    if (Number(user.id) === Number(me.id)) return;

    const isFollowing = myFollowingIds.includes(Number(user.id));
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center p-3 gap-3";
    li.setAttribute('data-username', user.username);

    li.innerHTML = `
        <div class="user-info d-flex align-items-center text-truncate">
            <img src="${user.avatar}" class="rounded-circle me-3 flex-shrink-0" style="width:40px; height:40px;">
            <span class="fw-bold user-name-container">@${user.username}</span>
        </div>
        <button class="btn btn-sm ${isFollowing ? 'btn-success' : 'btn-outline-primary'} follow-btn flex-shrink-0" 
                data-user-id="${user.id}">
            ${isFollowing ? 'Following' : 'Follow'}
        </button>
    `;
    userListElement.appendChild(li);
    });
}

// User profile and follow/unfollow button
document.querySelector('#user-list').addEventListener('click', async (e) => {
    const btn = e.target.closest('.follow-btn');
    const row = e.target.closest('li');

    if (btn) {
        e.stopPropagation();
        const userId = btn.getAttribute('data-user-id');
        const isCurrentlyFollowing = btn.classList.contains('btn-success');
        const route = isCurrentlyFollowing ? `/api/user/unfollow/${userId}` : `/api/user/follow/${userId}`;

        const res = await fetch(route, { method: 'POST', ...fetchOptions });
        if (res.ok) {
            btn.classList.toggle('btn-success');
            btn.classList.toggle('btn-outline-primary');
            btn.textContent = btn.classList.contains('btn-success') ? 'Following' : 'Follow';
            loadFeed();
        }
        return;
    }

    if (row) {
        const username = row.getAttribute('data-username');
        window.location.href = `/profile/${username}`;
    }
});


// Post howl
const howlContainer = document.querySelector('#howl-input');
const howlTextarea = howlContainer.querySelector('textarea');
const howlSubmitBtn = howlContainer.querySelector('.btn-danger');

howlSubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 
    const text = howlTextarea.value.trim();
   
    if (!text) {
        alert("Enter text to howl!");
        return;
    }

    try {
        const response = await fetch("/api/howl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text }),
            credentials: "include"
        });
        console.log("Response status:", response.status); 
        if (response.ok) {
            howlTextarea.value = '';
            loadFeed();
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.error);
        }
    } catch (err) {
        console.error("Network error while posting howl:", err);
    }
});



// Get howl feed
async function loadFeed() {
    const howlList = document.querySelector('#howl-list');
    try {
        const response = await fetch("/api/howl/following", fetchOptions);
        const data = await response.json();
        const howls = Array.isArray(data) ? data : [];

        if (howls.length === 0) {
            howlList.innerHTML = "<p class='text-center mt-4'>Follow someone to see howls.</p>";
            return;
        }

        howlList.innerHTML = howls.map(howl => `
        <div class="card mb-3 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <span class="fw-bold">@${howl.username || 'User ' + howl.userId}</span>
                    <small class="text-muted">${new Date(howl.datetime).toLocaleString()}</small>
                </div>
                <p class="mt-2 mb-0">${howl.text}</p>
            </div>
        </div>
    `).join('');
    } catch (err) {
        console.error("loadFeed Error:", err);
    }
}

// Call functions
loadUsers();
loadFeed();
