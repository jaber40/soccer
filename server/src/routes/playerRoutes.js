// src/routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerService = require('../services/playerService');

// Endpoint to fetch player details based on country and tournament
router.get('/details', async (req, res) => {
  const { countryId, tournamentId } = req.query;

  // Ensure the query parameters are provided and are valid
  if (!countryId || !tournamentId) {
    return res.status(400).json({ error: 'countryId and tournamentId are required' });
  }

  // Convert string query params to numbers if necessary
  const parsedCountryId = parseInt(countryId, 10);
  const parsedTournamentId = parseInt(tournamentId, 10);

  if (isNaN(parsedCountryId) || isNaN(parsedTournamentId)) {
    return res.status(400).json({ error: 'Invalid countryId or tournamentId' });
  }

  try {
    const players = await playerService.getPlayerDetailsByCountryAndTournament(parsedCountryId, parsedTournamentId);
    res.json(players);
  } catch (err) {
    console.error('Error fetching player details:', err);  // Log error for debugging
    return res.status(500).json({ error: 'Database query failed', details: err.message });  // Return more detailed error message
  }
});

module.exports = router;


