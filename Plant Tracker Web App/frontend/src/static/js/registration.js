import api from './APIClient.js';
const registerForm = document.getElementById('register');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');

const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  api.register(username.value, email.value, password.value)
    .then(data => {
      showNotification('Registration successful! Please login.', 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500); // slight delay to show the success message before redirect
    })
    .catch(error => {
      console.log(error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.message && error.message.includes('already exists')) {
        errorMessage = "Username or email already exists.";
      }
      showNotification(errorMessage, 'error');
    });
});