// src/dao/playerDAO.js
const getDBPool = require('../utils/dbPool'); // Import the utility for handling DB pool

// Fetch player details by country and tournament using promises
const getPlayerDetailsByCountryAndTournament = (countryId, tournamentId) => {
  return new Promise((resolve, reject) => {
    const db_pool = getDBPool();

    // SQL query to fetch player details
    const query = `
      SELECT * FROM player
  INNER JOIN player_tournament ON player.player_id = player_tournament.player_id
  INNER JOIN club ON player_tournament.club_id = club.club_id
  INNER JOIN city C2 ON club.city_id = C2.city_id
  INNER JOIN city ON player.city_id = city.city_id
  INNER JOIN country ON city.country_id = country.country_id
  INNER JOIN league ON player_tournament.league_id = league.league_id
  WHERE player.country_id = ? 
    AND player_tournament.tournament_id = ?
  ORDER BY player_tournament.number + 0
    `;

    // Execute the query
    db_pool.query(query, [countryId, tournamentId], (err, results) => {
      if (err) {
        console.error(`Error executing query for countryId ${countryId} and tournamentId ${tournamentId}:`, err);
        return reject(err); // Reject if an error occurs
      }

      if (!results || results.length === 0) {
        console.warn(`No players found for countryId ${countryId} and tournamentId ${tournamentId}`);
        return resolve([]); // Resolve with an empty array if no players found
      }

      resolve(results); // Resolve with fetched player details
    });
  });
};

module.exports = {
  getPlayerDetailsByCountryAndTournament
};

