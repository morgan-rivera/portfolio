// here - i followed day 22 exercise again. removed fetch
import api from './APIClient.js';

const loginForm = document.getElementById('login');
const email = document.getElementById('email');
const password = document.getElementById('password');

const errorBox = document.getElementById('errorbox');

function showError(message) {
  if (errorBox) {
    errorBox.classList.remove("hidden");
    errorBox.textContent = message;
  } else {
    alert(message);
  }
}

// form validation
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  if (errorBox) errorBox.classList.add("hidden"); // hide any previous error

  // using email as identifier (since our api uses identifier field)
  api.login(email.value, password.value)
    .then(data => {
      localStorage.setItem('userId', data.user.id); // for push notf. implementation. after user login, store userId in localstorage
      window.location.href = '/login-success'; // redirect to our cool success page 
    })
    .catch(error => {
      console.log(error);
      showError("Invalid email or password");
    });
});