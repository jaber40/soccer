// src/services/playerSelService.js
const player_selDAO = require('../dao/playerSelDAO');

// Service function to get the selected player details
const getSelectedPlayerDetails = async (playerId, tournamentId) => {
  try {
    const player = await player_selDAO.getSelectedPlayerDetails(playerId, tournamentId);
    return player;
  } catch (err) {
    throw new Error('Error fetching selected player details: ' + err.message);
  }
};

module.exports = {
  getSelectedPlayerDetails
};
