// src/dao/playerDAO.js
const getDBPool = require('../utils/dbPool'); // Import the utility for handling DB pool

// Fetch players by country and tournament
const getPlayersByCountryAndTournament = (countryId, tournamentId, callback) => {
  const db_pool = getDBPool();

  // SQL query to fetch players based on country and tournament ID
  const query = `
    SELECT player_name
    FROM player
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
      return callback(err, null);
    }

    if (!results || results.length === 0) {
      console.warn(`No players found for countryId ${countryId} and tournamentId ${tournamentId}`);
      return callback(null, []); // Return empty array if no players found
    }

    callback(null, results); // Return the fetched players
  });
};

module.exports = {
  getPlayersByCountryAndTournament
};
