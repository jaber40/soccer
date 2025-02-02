// src/routes/playerRoutes.js
const express = require('express');
const playerService = require('../services/playerService'); // Service to handle fetching players
const router = express.Router();

// Route to get players for a given country and tournament
router.get('/:countryId/:tournamentId', (req, res) => {
  const { countryId, tournamentId } = req.params;

  // Query the database for players based on country and tournament ID
  playerService.getPlayersByCountryAndTournament(countryId, tournamentId, (err, players) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch players' });
    }
    res.json(players); // Return the players
  });
});

module.exports = router;
