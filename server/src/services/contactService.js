//server/src/services/contactService.js
const validator = require('validator');
const { saveContact } = require('../dao/contactDAO');

async function submitContact(formData) {
  let { name, email, message } = formData;

  // Validate
  if (!validator.isLength(name || "", { min: 1, max: 255 })) {
    throw new Error("Invalid name");
  }
  if (!validator.isEmail(email || "")) {
    throw new Error("Invalid email");
  }
  if (!validator.isLength(message || "", { min: 1, max: 2000 })) {
    throw new Error("Invalid message");
  }

  // Sanitize
  name = validator.escape(name);
  email = validator.normalizeEmail(email);
  message = validator.escape(message);

  return await saveContact(name, email, message);
}

module.exports = {
  submitContact
};
