const loginForm = document.querySelector('#loginForm');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const errorBox = document.querySelector('#errorbox');

// error box
function showError(error) {
  errorBox.classList.remove("d-none"); 
  errorBox.textContent = error;
}

// submit login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.add("d-none");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      }),
      credentials: "include"
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const err = await response.json();
            throw new Error(err.error || "Login failed");
        } else {
            throw new Error(`Server Error: ${response.status}`);
        }
    }

    await response.json();
    window.location.href = "./feed";

  } catch (error) {
    showError(error.message);
  }
});
