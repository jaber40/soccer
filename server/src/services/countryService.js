// src/services/countryService.js
const countryDAO = require('../dao/countryDAO'); // Import countryDAO (to interact with the database)

// Service function to get countries by tournament
const getCountriesByTournament = (tournamentId, callback) => {
  // Call DAO layer to fetch countries
  countryDAO.getCountriesByTournament(tournamentId, (err, countries) => {
    if (err) {
      console.error(`Error fetching countries for tournamentId ${tournamentId}:`, err);
      return callback({ error: 'Failed to fetch countries' }); // Return a consistent error object
    }

    if (!countries || countries.length === 0) {
      console.warn(`No countries found for tournamentId ${tournamentId}`);
      return callback(null, []); // Return an empty array for no results
    }

    callback(null, countries); // Return the fetched countries
  });
};

module.exports = {
  getCountriesByTournament // Ensure this is correctly exported
};
