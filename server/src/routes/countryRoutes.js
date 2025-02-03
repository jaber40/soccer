const express = require('express');
const countryService = require('../services/countryService'); // Service to handle fetching countries
const router = express.Router();

// Route to get countries for a given tournament
router.get('/:tournamentId', (req, res) => {
  const { tournamentId } = req.params; // Extract tournament ID
  console.log('Tournament ID received on backend:', tournamentId); // Log to ensure correct value is received

  // Query the database for countries using tournamentId
  countryService.getCountriesByTournament(tournamentId, (err, countries) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch countries' });
    }
    res.json(countries); // Return the countries
  });
});


module.exports = router;
