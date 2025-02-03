// src/services/tournamentService.js
const tournamentDAO = require('../dao/tournamentDAO');

// Service function to get tournament names
const getTournaments = (callback) => {
  tournamentDAO.getTournaments((err, tournaments) => {
    if (err) {
      return callback({ error: 'Failed to fetch tournaments' });
    }
    callback(null, tournaments); // Return tournaments to the controller
  });
};

module.exports = {
  getTournaments
};
