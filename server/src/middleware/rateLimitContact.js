//server/src/middleware/rateLimitContact.js
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: "Too many submissions. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = contactLimiter;

