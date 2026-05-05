module.exports = function validatePayment(body, file) {
  let valid = true;
  let errors = [];

  const MAX_SIZE = 200 * 1024;
  const senderFirstName = body.senderFirstName ? body.senderFirstName.trim() : '';
  const senderLastName = body.senderLastName ? body.senderLastName.trim() : '';
  const recipientFirstName = body.recipientFirstName ? body.recipientFirstName.trim() : '';
  const recipientLastName = body.recipientLastName ? body.recipientLastName.trim() : '';
  const recipientMessage = body.recipientMessage ? body.recipientMessage.trim() : '';
  const notifyOption = body.notifyRecipientMulti;
  const recipientEmail = body.recipientEmail ? body.recipientEmail.trim() : '';
  const recipientPhoneNumber = body.recipientPhoneNumber ? body.recipientPhoneNumber.trim() : '';
  const cardNumber = body.cardNumber ? body.cardNumber.trim() : '';
  const expirationDateStr = body.expirationDate ? body.expirationDate.trim() : '';
  const CCV = body.CCV ? body.CCV.trim() : '';
  const amount = body.amount ? body.amount.trim() : '';
  const terms = body.terms ? body.terms.trim() : '';

  if (!file) {
    valid = false;
    errors.push("Image required");
  }
  else if (file.size > MAX_SIZE) {
    valid = false;
    errors.push("Image file cannot be larger than 200kb");
  }   
  
  if (!senderFirstName) {
    valid = false;
    errors.push('Sender must have a first name');
  }
    
  if (!senderLastName) {
    valid = false;
    errors.push('Sender must have a last name');
  }
  
  if (!recipientFirstName) {
    valid = false;
    errors.push('Recipient must have a first name');
  }
    
  if (!recipientLastName) {
    valid = false;
    errors.push('Recipient must have a last name');
  }

  if (!recipientMessage || recipientMessage.length < 10) {
    valid = false;
    errors.push('Recipient message must be at least 10 characters long');
  }

  if (!notifyOption) {
    valid = false;
    errors.push('Must select a Notify Recipient option');
  }

  if (notifyOption == 'email' && recipientEmail === '') {
    valid = false;
    errors.push('Recipient email is required');
  }

  if (notifyOption == 'sms' && recipientPhoneNumber === '') {
    valid = false;
    errors.push('Recipient phone number is required');
  }

  if (!cardNumber) {
    valid = false;
    errors.push('Card number must follow format "XXXX-XXXX-XXXX-XXXX" where all Xs are numbers');
  }

  expirationDate = new Date(expirationDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (expirationDate < today) {
    valid = false;
    errors.push("Card must not be expired");
  }
  
  if (CCV < 100 || CCV > 9999) {
    valid = false;
    errors.push('CCV should be 3 to 4 numbers');
  }

  if (amount < 0 ) {
    valid = false;
    errors.push('Amount must be positive');
  }

  if (!terms) {
    valid = false;
    errors.push('You must agree to terms');
  }

  if ((recipientFirstName === 'Stuart' || recipientFirstName === 'Stu') && recipientLastName === 'Dent') {
    valid = false;
    errors.push('Recipient is banned');
  }
    

  if (!valid) {
    console.log(errors);
    return false;
  }
  return true;
};