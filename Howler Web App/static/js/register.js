const registerForm = document.querySelector('#registerForm');
const first_name = document.querySelector('#first_name');
const last_name = document.querySelector('#last_name');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const errorBox = document.querySelector('#errorbox');

// error box
function showError(error) {
  errorBox.classList.remove("d-none"); 
  errorBox.textContent = error;
}

// register form
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        username: username.value,
        password: password.value
      }),
      credentials: "include"
    });

    const contentType = response.headers.get("content-type");
  
    if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
        const err = await response.json();
        throw new Error(err.error || "Registration failed");
        } else {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
        }
    }
    await response.json();
    window.location.href = "./";

  } catch (error) {
    showError(error.message);

  }
});
