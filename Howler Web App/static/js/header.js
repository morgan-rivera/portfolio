async function initHeader() {
  try {
    // username and avatar
    const response = await fetch("/api/user/current"); 
    
    if (!response.ok) 
        throw new Error("Not logged in");

    const user = await response.json();
    document.querySelector('#username').textContent = `@${user.username}`;
    document.querySelector('#avatar').src = user.avatar;

    // logout
    document.querySelector('#logout-btn').addEventListener('click', async () => {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        if (res.ok) {
            window.location.href = "/";
        }
    });

  } catch (err) {
        console.error("Header Error:", err);
        window.location.href = "/"; 
  }
}

initHeader();
