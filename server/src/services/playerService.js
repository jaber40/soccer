// src/services/playerService.js
const playerDAO = require('../dao/playerDAO');

// Fetch player details by country and tournament using async/await
const getPlayerDetailsByCountryAndTournament = async (countryId, tournamentId) => {
  try {
    const players = await playerDAO.getPlayerDetailsByCountryAndTournament(countryId, tournamentId);
    return players;
  } catch (err) {
    throw new Error('Error fetching player details: ' + err.message); // Throw error to be caught by the controller
  }
};

module.exports = {
  getPlayerDetailsByCountryAndTournament
};

