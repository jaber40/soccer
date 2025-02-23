// src/dao/playerSelDAO.js
const getDBPool = require('../utils/dbPool');

// Fetch selected player details by playerId and tournamentId
const getSelectedPlayerDetails = (playerId, tournamentId) => {
  return new Promise((resolve, reject) => {
    const db_pool = getDBPool();

    const query = `
      SELECT 
        player_tournament.*, 
        club.*, 
        league.*, 
        player.*, 
        city.city_name AS player_city_name, 
        city.x AS player_x, 
        city.y AS player_y, 
        C2.city_name AS club_city_name, 
        C2.x AS club_x, 
        C2.y AS club_y, 
        country.*, 
        CN2.country_name AS club_country_name
      FROM player_tournament
      INNER JOIN club ON player_tournament.club_id = club.club_id
      INNER JOIN league ON player_tournament.league_id = league.league_id
      INNER JOIN player ON player.player_id = player_tournament.player_id
      INNER JOIN city C2 ON club.city_id = C2.city_id
      INNER JOIN city ON player.city_id = city.city_id
      INNER JOIN country CN2 ON C2.country_id = CN2.country_id
      INNER JOIN country ON city.country_id = country.country_id
      WHERE player.player_id = ?
      AND player_tournament.tournament_id = ?`;

    db_pool.query(query, [playerId, tournamentId], (err, results) => {
      if (err) {
        console.error(`Error executing query for playerId ${playerId} and tournamentId ${tournamentId}:`, err);
        return reject(err);
      }

      if (!results || results.length === 0) {
        return reject(new Error(`No player found for playerId ${playerId} and tournamentId ${tournamentId}`));
      }

      resolve(results[0]); // Return the first (and only) player result
    });
  });
};

module.exports = {
  getSelectedPlayerDetails
};
