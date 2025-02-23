// src/routes/playerSelRoutes.js
const express = require('express');
const router = express.Router();
const playerSelService = require('../services/playerSelService'); // Corrected import path

// Endpoint to fetch selected player details based on playerId and tournamentId
router.get('/selected/details', async (req, res) => {
  const { playerId, tournamentId } = req.query;

  if (!playerId || !tournamentId) {
    return res.status(400).json({ error: 'playerId and tournamentId are required' });
  }

  try {
    const player = await playerSelService.getSelectedPlayerDetails(playerId, tournamentId);
    res.json(player); // Return the selected player details
  } catch (err) {
    console.error('Error fetching selected player details:', err);
    return res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

module.exports = router;
