const fetchOptions = { credentials: "include" };

// Profile
async function loadProfile() {
    const pathParts = window.location.pathname.split('/');
    const username = pathParts[pathParts.length - 1];

    try {
        const [userRes, meRes, allUsersRes] = await Promise.all([
            fetch(`/api/user/${username}`, fetchOptions),
            fetch('/api/user/current', fetchOptions),
            fetch('/api/users', fetchOptions)
        ]);

        const targetUser = await userRes.json();
        const me = await meRes.json();
        const rawUsers = await allUsersRes.json();
        const allUsers = Array.isArray(rawUsers) ? rawUsers : Object.values(rawUsers);
        document.querySelector('#profile-display-username').textContent = `@${targetUser.username}`;
        document.querySelector('#profile-avatar-img').src = targetUser.avatar; 
        document.querySelector('#profile-display-name').textContent = `${targetUser.first_name} ${targetUser.last_name}`;

        // Follow / Unfollow Button
        if (Number(targetUser.id) !== Number(me.id)) {
            renderFollowButton(targetUser.id);
        } else {
            const section = document.querySelector('#profile-follow-section');
            if (section) 
                section.innerHTML = ''; 
        }

        // Load user howls and following list
        loadUserHowls(username);
        renderFollowingList(username, allUsers);

    } catch (err) {
        console.error("Profile load failed:", err);
    }
}

// following list
async function renderFollowingList(username, allUsers) {
    const listElement = document.querySelector('#profile-following-list');
    if (!listElement) return;

    try {
        const res = await fetch(`/api/user/${username}/following`, fetchOptions);
        const followingIds = await res.json();

        if (!Array.isArray(followingIds) || followingIds.length === 0) {
            listElement.innerHTML = "<li class='list-group-item text-muted'>Not following anyone.</li>";
            return;
        }

        // user avatar and username
        listElement.innerHTML = followingIds.map(id => {
            const u = allUsers.find(user => Number(user.id) === Number(id));
            if (!u) return ''; 
            console.log(u);
            return `
                <li class="list-group-item d-flex align-items-center p-2">
                    <img src="${u.avatar}" class="rounded-circle me-2" style="width:30px; height:30px;">
                    <a href="/profile/${u.username}" class="text-decoration-none text-dark fw-bold">@${u.username}</a>
                </li>
            `;
        }).join('');
    } catch (err) {
        console.error("Error loading following list:", err);
        listElement.innerHTML = "<li class='list-group-item text-danger'>Error loading list.</li>";
    }
}

// Follow/Unfollow button
async function renderFollowButton(targetUserId) {
    const section = document.querySelector('#profile-follow-section');
    const res = await fetch('/api/user/following', fetchOptions);
    const followingIds = await res.json();
    const isFollowing = followingIds.map(Number).includes(Number(targetUserId));

    section.innerHTML = `
        <button class="btn ${isFollowing ? 'btn-success' : 'btn-outline-primary'} px-4 follow-btn">
            ${isFollowing ? 'Following' : 'Follow'}
        </button>
    `;

    section.querySelector('button').onclick = async () => {
        const route = isFollowing ? `/api/user/unfollow/${targetUserId}` : `/api/user/follow/${targetUserId}`;
        const toggleRes = await fetch(route, { method: 'POST', ...fetchOptions });
        if (toggleRes.ok) renderFollowButton(targetUserId); 
    };
}

// User howls
async function loadUserHowls(username) {
    const howlList = document.querySelector('#profile-howl-list');
    try {
        const response = await fetch(`/api/howl/${username}`, fetchOptions);
        const howls = await response.json();

        if (!howls || howls.length === 0) {
            howlList.innerHTML = "<p class='text-muted'>No howls yet.</p>";
            return;
        }

        howlList.innerHTML = howls.map(howl => `
            <div class="card mb-3 shadow-sm p-3">
                <p class="mb-1">${howl.text}</p>
                <small class="text-muted">${new Date(howl.datetime).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading user howls:", err);
    }
}

loadProfile();
