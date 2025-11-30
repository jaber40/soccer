// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();

const { submitContact } = require('../services/contactService');
const contactLimiter = require('../middleware/rateLimitContact');

router.post('/', contactLimiter, async (req, res) => {
  try {
    // Honeypot: if filled → bot
    if (req.body.website && req.body.website.trim() !== "") {
      return res.status(200).json({ success: true });
    }

    const id = await submitContact(req.body);

    res.status(200).json({
      success: true,
      id
    });

  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;

