// src/services/playerService.js
const playerDAO = require('../dao/playerDAO'); // Import playerDAO (to interact with the database)

// Service function to get players by country and tournament
const getPlayersByCountryAndTournament = (countryId, tournamentId, callback) => {
  playerDAO.getPlayersByCountryAndTournament(countryId, tournamentId, (err, players) => {
    if (err) {
      console.error(`Error fetching players for countryId ${countryId} and tournamentId ${tournamentId}:`, err);
      return callback({ error: 'Failed to fetch players' });
    }
    callback(null, players); // Return the fetched players
  });
};

module.exports = {
  getPlayersByCountryAndTournament
};
