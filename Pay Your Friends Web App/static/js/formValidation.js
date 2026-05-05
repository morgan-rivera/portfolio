export default function validateForm(event) {
  const form = event.target;

  const imageInput = form.querySelector('#image');
  const senderFirstName = form.querySelector('#senderFirstName');
  const senderLastName = form.querySelector('#senderLastName');
  const recipientFirstName = form.querySelector('#recipientFirstName');
  const recipientLastName = form.querySelector('#recipientLastName');
  const recipientMessage = form.querySelector('#recipientMessage');
  const notifyRecipientMulti = form.querySelectorAll('input[name="notifyRecipientMulti"]');
  const notifyRecipientMultiChecked = form.querySelector('input[name="notifyRecipientMulti"]:checked');
  const recipientEmail = form.querySelector('#recipientEmail');
  const recipientPhoneNumber = form.querySelector('#recipientPhoneNumber');
  const cardNumber = form.querySelector('#cardNumber');
  const expirationDate = form.querySelector('#expirationDate');
  const CCV = form.querySelector('#CCV');
  const amount = form.querySelector('#amount');
  const terms = form.querySelector('#terms');

  let isValid = true;
  imageInput.setCustomValidity('');
  senderFirstName.setCustomValidity('');
  senderLastName.setCustomValidity('');
  recipientFirstName.setCustomValidity('');
  recipientLastName.setCustomValidity('');
  recipientMessage.setCustomValidity('');
  recipientEmail.setCustomValidity('');
  recipientPhoneNumber.setCustomValidity('');
  cardNumber.setCustomValidity('');
  expirationDate.setCustomValidity('');
  CCV.setCustomValidity('');
  amount.setCustomValidity('');
  terms.setCustomValidity('');


  if (!imageInput.files[0]) {
    imageInput.setCustomValidity('Image required');
    isValid = false;
  } 
  else if (imageInput.files[0].size > 200 * 1024) {
    imageInput.setCustomValidity('Image must be under 200KB');
    isValid = false;
  }

  if (!senderFirstName.checkValidity()) {
    senderFirstName.setCustomValidity('Sender must have a first name');
    isValid = false;
  }

  if (!senderLastName.checkValidity()) {
    senderLastName.setCustomValidity('Sender must have a last name');
    isValid = false;
  }

  if (!recipientFirstName.checkValidity()) {
    recipientFirstName.setCustomValidity('Recipient must have a first name');
    isValid = false;
  }
 
  if (!recipientLastName.checkValidity()) {
    recipientLastName.setCustomValidity('Recipient must have a last name');
    isValid = false;
  }

  if (!recipientMessage.checkValidity()) {
    recipientMessage.setCustomValidity('Recipient message must be at least 10 characters long');
    isValid = false;
  }
  
  if (!notifyRecipientMultiChecked) {
    notifyRecipientMulti[0].setCustomValidity('Notify Recipient is required');
    isValid = false;
  }
  else 
    notifyRecipientMulti.forEach(input => input.setCustomValidity(''));

  if (notifyRecipientMultiChecked && notifyRecipientMultiChecked.value === 'email' && !recipientEmail.value.trim()) {
    recipientEmail.setCustomValidity('Recipient email is required');
    isValid = false;
  }

  if (notifyRecipientMultiChecked && notifyRecipientMultiChecked.value === 'sms' && !recipientPhoneNumber.value.trim()) {
    recipientPhoneNumber.setCustomValidity('Recipient phone number is required');
    isValid = false;
  }

  if (!cardNumber.checkValidity()) {
    cardNumber.setCustomValidity('Card number must follow format "XXXX-XXXX-XXXX-XXXX" where all Xs are numbers');
    isValid = false;
  }

  const expiration = new Date(expirationDate.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (expiration < today) {
    expirationDate.setCustomValidity('Card must not be expired');
    isValid = false;
  }

  if (!CCV.checkValidity()) {
    CCV.setCustomValidity('CCV must be 3 to 4 numbers');
    isValid = false;
  }

  if (!terms.checkValidity()) {
    terms.setCustomValidity('Terms must be selected');
    isValid = false;
  }

  if (!isValid) {
    event.preventDefault();
    form.reportValidity();
  }

}