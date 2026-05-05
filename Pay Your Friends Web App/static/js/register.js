import validateForm from './formValidation.js';

const form = document.querySelector('#send');
form.addEventListener('submit', validateForm);
